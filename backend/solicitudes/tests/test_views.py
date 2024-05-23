from json import loads
from random import getrandbits
from django.urls import reverse
from unittest.mock import patch
from rest_framework import status
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from rest_framework.test import APITestCase, APIClient

from solicitudes.models import Solicitud


class SolicitudViewSetTests(APITestCase):
    fixtures = ['testing_db.json']

    @classmethod
    def setUpTestData(cls):
        # URLs de la API
        cls.URL_sol_list = reverse('solicitud-list')
        cls.URL_login = reverse('login')
        cls.URL_refresh = reverse('refresh-login')

        # Crear un cliente autenticado
        cls.user = User.objects.get(username='admin')
        cls.auth_client = APIClient()
        cls.auth_client.force_authenticate(user=cls.user)

        # Crear un cliente no autenticado
        cls.client = APIClient()

    # Login
    def test_login_and_refresh_success(self):
        res = self.client.post(self.URL_login, {'username': 'admin', 'password': 'pass'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = loads(res.content)
        self.assertTrue('access' in data)
        self.assertTrue('refresh' in data)

        # La unica forma de conseguir el token de refresh es mediante el login,
        # con lo cual tuve que dejar juntas las pruebas
        res = self.client.post(self.URL_refresh, {'refresh': data['refresh']})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in loads(res.content))

    def test_login_error(self):
        res = self.client.post(self.URL_login, {'username': 'admin', 'password': 'wrong_password'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_error(self):
        res = self.client.post(self.URL_refresh, {'refresh': 'wrong_token'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


    # POST
    @patch('solicitudes.views.request_loan')
    def test_POST_success(self, mock_request_loan):
        mock_request_loan.return_value = bool(getrandbits(1))

        sol_copy = model_to_dict(Solicitud.objects.first())
        amount_before = Solicitud.objects.count()

        res = self.client.post(self.URL_sol_list, sol_copy)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertGreater(Solicitud.objects.count(), amount_before)
        self.assertEqual(loads(res.content)['first_name'], sol_copy['first_name'])

    def test_POST_error(self):
        sol_copy = model_to_dict(Solicitud.objects.first())
        sol_copy['first_name'] = 'Charly123'
        res = self.client.post(self.URL_sol_list, sol_copy)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


    # GET list
    def test_GET_list_success(self):
        res = self.auth_client.get(self.URL_sol_list)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(loads(res.content)['results']), Solicitud.objects.count())

    def test_GET_list_search(self):
        sol = Solicitud.objects.first()
        res = self.auth_client.get(self.URL_sol_list, {'search': sol.first_name})
        self.assertEqual(loads(res.content)['results'][0]['first_name'], sol.first_name)

    def test_GET_list_error(self):
        res = self.client.get(self.URL_sol_list)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


    # GET by ID
    def test_GET_byID_success(self):
        sol = Solicitud.objects.first()
        res = self.auth_client.get(reverse('solicitud-detail', kwargs={'pk': sol.id}))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(loads(res.content)['id'], sol.id)

    def test_GET_byID_not_found(self):
        res = self.auth_client.get(reverse('solicitud-detail', kwargs={'pk': -1}))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_GET_byID_error(self):
        sol = Solicitud.objects.first()
        res = self.client.get(reverse('solicitud-detail', kwargs={'pk': sol.id}))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


    # PATCH
    def test_PATCH_success(self):
        sol = Solicitud.objects.first()
        sol_copy = model_to_dict(sol)
        sol_copy['first_name'] = 'Luis Alberto'
        sol_copy['last_name'] = 'Spinetta'

        res = self.auth_client.patch(reverse('solicitud-detail', kwargs={'pk': sol.id}), sol_copy)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        content = loads(res.content)
        self.assertEqual(content['first_name'], sol_copy['first_name'])
        self.assertNotEqual(content['first_name'], sol.first_name)

    def test_PATCH_not_found(self):
        sol = Solicitud.objects.first()
        sol_copy = model_to_dict(sol)
        res = self.auth_client.patch(reverse('solicitud-detail', kwargs={'pk': -1}), sol_copy)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_PATCH_error(self):
        sol = Solicitud.objects.first()
        sol_copy = model_to_dict(sol)
        res = self.client.patch(reverse('solicitud-detail', kwargs={'pk': sol.id}), sol_copy)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


    # DELETE
    def test_DELETE_success(self):
        amount_before = Solicitud.objects.count()
        sol = Solicitud.objects.first()
        res = self.auth_client.delete(reverse('solicitud-detail', kwargs={'pk': sol.id}))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Solicitud.objects.count(), amount_before - 1)

    def test_DELETE_not_found(self):
        res = self.auth_client.delete(reverse('solicitud-detail', kwargs={'pk': -1}))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_DELETE_error(self):
        sol = Solicitud.objects.first()
        res = self.client.delete(reverse('solicitud-detail', kwargs={'pk': sol.id}))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
