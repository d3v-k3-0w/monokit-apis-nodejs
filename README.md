# Monokit - APIs en Node.js

Este es un mono-repositorio que contiene varias APIs en Node.js. Cada API se encuentra dentro de la carpeta `packages`. Este proyecto es codificado por `dev-kei-ow`.

## Estructura del Repositorio

El repositorio está estructurado de la siguiente manera:

```
/
├── packages/
│   ├── notes-api/
│   └── ...
└── README.md
```

Cada carpeta dentro de `packages` representa una API individual.

## Trabajando con Workspaces en NPM

```json
{
	"name": "monokit-apis-nodejs",
	"description": "",
	"private": true,
	"workspaces": ["packages/*"],
	"author": "dev-kei-ow",
	"license": "ISC"
}
```

Este proyecto utiliza la característica de Workspaces de NPM para manejar múltiples paquetes dentro de un solo repositorio. La clave workspaces en nuestro package.json le dice a NPM cuáles directorios deben ser tratados como paquetes individuales dentro de este monorepositorio.

- `private`: Un booleano que, cuando se establece en true, evita que este paquete sea publicado en el registro de npm y evitar que se publique accidentalmente el monorepositorio completo como un solo paquete.
- `workspaces`: le dice a NPM cuáles directorios deben ser tratados como paquetes individuales dentro de este monorepositorio.
- `license`: La licencia bajo la cual se distribuye tu proyecto.

Cuando ejecutas npm install en la raíz de este monorepositorio, NPM instalará todas las dependencias de todos los paquetes en un solo directorio node_modules en la raíz del proyecto.

## Dependencias

Aquí hay una lista de las dependencias que se utilizan en este proyecto junto con una breve descripción de cada una:

- `bcrypt`: Una biblioteca para ayudar en la generación de hashes para la seguridad de las contraseñas.
- `cors`: Middleware para habilitar CORS (Cross-Origin Resource Sharing) en nuestras APIs.
- `dotenv`: Un módulo que carga variables de entorno desde un archivo `.env` en `process.env`.
- `cross-env`: Permite establecer y utilizar variables de entorno de manera consistente en cualquier sistema operativo.
- `express`: Un marco de aplicación web para Node.js que se utiliza para construir las APIs.
- `jsonwebtoken`: Una implementación de tokens de acceso JSON Web Token (JWT) que se utilizan para autenticación y autorización.
- `mongoose`: Una biblioteca de MongoDB que proporciona una solución directa basada en esquemas para modelar los datos de la aplicación.

## Cómo Agregar una Nueva API

Para agregar una nueva API al repositorio, simplemente crea una nueva carpeta dentro de `packages` y añade el código de tu API allí. Asegúrate de añadir un `package.json` para tu API con todas las dependencias necesarias.

## Cómo Agregar Nuevas Dependencias

Cuando agregues nuevas dependencias a tus APIs, asegúrate de añadirlas a la lista de dependencias en este README con una breve descripción de para qué se utiliza. Esto ayudará a mantener a todos en el mismo nivel de entendimiento sobre las herramientas que se utilizan en el proyecto.

Esperamos que este README te ayude a navegar y entender mejor la estructura de este mono-repositorio. ¡Feliz codificación!
