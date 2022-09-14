# UNaHur - Estrategias de persistencia

## Clase Nro 5.

A partir de esta clase comenzaremos a trabajar en el trabajo práctico de la materia, el mismo tendrá la posibilidad de hacerse en grupo siendo esto opcional.

Si se decidiera por un trabajo grupal, la cantidad de miembros por grupos no pueden superar los 3 integrantes.

Les pido que me envíen los nombres de cada uno de los integrantes del grupo, así los anoto para su defensa en el final. Si desean realizarlo de manera individual, también es necesario
que me lo indiquen.

Este trabajo práctico, consta de dos instancias de código, dichas instancias son pequeñas funcionalidades que le iremos sumando a lo largo de la cursada.

El trabajo práctico que vamos a realizar será una API (Application Programming Interface), Traducido: INTERFAZ DE PROGRAMACION DE APLICACIONES

### Primera parte

Para esta primera instancia del trabajo práctico, se pide realizar una entidad llamada materia que va a contener las diferentes materias que tiene una carrera.

La tabla a crear deberá tener los siguientes campos:

- Tabla materia
- nombre (String)
- id_carrera (Entero)

La idea es que, leyendo el código subido al repositorio puedan realizar esta nueva entidad.

Repositorio: https://gitlab.com/pmarcelli/unahur_alumnos_1_2020.git

### Instructivos para levantar el proyecto:
1) clonar el código del repositorio:

```git clone https://gitlab.com/pmarcelli/unahur_alumnos_1_2020.git estrategias-persistencia```

2) eliminar carpeta .git

```git init```

```git remote add origin https://github.com/pablo-origlia/estrategias-persistencia.git```

3) Entrar a estrategias-persistencia/api.

```cd estrategias-persistencia/api```

4) Realizar la instalación de sus dependencias.

```npm install```

5) Realizar la instalación de sequelize-cli

```npm install sequelize-cli –-save```

6) Ejecutar las migraciones -> estas son las creaciones de la base de datos.

```npx sequelize db:migrate```

7) Levantar la api, con la siguiente instrucción.

```DEBUG=api:* npm start``` (Unix)

```set DEBUG='api:*' & npm start``` (Windows)

8) Ingresar por navegador a: 

```http://localhost:3001/car```

Deberá aparecer un array vacío hasta tanto creemos un registro en nuestra base de datos
