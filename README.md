# Solicitud de préstamos - Prueba técnica de Moni

## Descripción del proyecto

Es un sitio web que ofrece un formulario para solicitar un préstamo. Una vez cargados los datos, los mismos son validados por frontend, backend y finalmente con la API de Moni para determinar si la solicitud del usuario es aceptada o no. Además cuenta con una sección de administración donde se pueden ver, editar y eliminar las solicitudes realizadas. Esta parte del sitio esta protegida y solo se puede acceder mediante un inicio de sesión.

## Tecnologías utilizadas

### Backend

El backend está desarrollado en **Django**, con el cual se realizan las transacciones a la base de datos y se exponen las views a ser utilizadas por el backend. También se utilizó la librería **rest_framework** para aprovechar su `ModelViewSet` y para facilitar la serialización de requests y responses a JSON. Finalmente, el manejo de tokens JWT se hizo mediante **simple_jwt**.

Para la base de datos se utilizó **sqlite**, que ya viene configurada por defecto con **Django**. Dado el caso de uso no vi necesario algo mas potente, y mantener la DB en el mismo repo facilita el setup y prueba del proyecto.

El testing se realizó con la librería **unittest**, que viene incluida con **python**. También se utilizaron algunas clases incluidas en **rest_framework**, para poder testear los endpoints más fácilmente.

### Frontend

Está construido con **React** en **Typescript**, y también se utilizó **TailwindCSS** para agilizar el manejo de **CSS**. La comunicación con el backend se hizo mediante **Axios**, la cual otorga algunas herramientas como los interceptors, que permiten agregar el token de autenticación a las requests de forma sencilla.

Ya que el foco principal era el backend el frontend se mantuvo simple. Idealmente haría falta algún global state manager como **Redux** para manejar mejor la información.

## Setup y testing

Ya que el proyecto está dockerizado, es necesario instalar [docker compose](https://docs.docker.com/compose/install/linux/). Una vez instalado se puede levantar mediante

```bash
docker compose up
docker-compose up # Para versiones viejas de docker
```

Una vez levantados los dos servicios se puede acceder al frontend mediante [http://localhost:8080/](http://localhost:8080/). Los datos de acceso del panel de administración son `admin/pass.`

En caso de querer hacer requests al backend los endpoints son los siguientes:

* `/auth/login/`: Loguearse mediante un POST con body `{"username": "admin", "password":"pass"}`
* `/auth/login/refresh/`: Refrescar el token de acceso con un POST con body `{"refresh":"[refresh_token]"}`
* `/solicitudes/`: Obtener la lista de solicitudes con un GET. Mediante `?search=` se puede filtrar por nombre, apellido o DNI, y `?page=` permite moverse entre paginas. Requiere un header `{"Authorization":"Bearer [token]"}`.
* `/solicitudes/`: Crear una nueva solicitud mediante POST. No es necesario el token de autorización, pero si requiere un body como el siguiente
  ```json
  {
      "first_name": "Charly",
      "last_name": "Garcia",
      "email": "charlygarcia@example.com",
      "dni": 12345678,
      "gender": "M",
      "amount": 100000.50
  }
  ```
* `/solicitudes/pk/`: Acepta GET, PATCH y DELETE. Para todos los casos es necesario un token de autorización


Los tests se pueden correr aparte o mientras el proyecto está corriendo.

```bash
docker exec backend python3 manage.py test # Correr tests dentro del container

python3 manage.py test # Correr aparte
```
