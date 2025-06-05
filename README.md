# Groovy Toolkit VS Code Extension

Extensión para Visual Studio Code que formatea código Groovy de manera automática y configurable.

## Características

- Elimina espacios y líneas en blanco innecesarias.
- Indenta bloques de código correctamente.
- Añade espacios alrededor de operadores (excepto dentro de strings).
- Normaliza comentarios y colecciones.
- Añade líneas en blanco donde corresponde para mejorar la legibilidad.
- Compatible con pipelines de Jenkins y scripts Groovy.

## Uso

1. Abre un archivo `.groovy` en VS Code.
2. Haz clic derecho y selecciona **Format Document** o usa el atajo `Shift+Alt+F`.

## Configuración

Puedes personalizar el tamaño de tabulación en la configuración de usuario de VS Code:

```json
"groovyFormatter.tabSize": 2
```

## Estructura del proyecto

- `extension.js`: Código principal de la extensión.
- `formatter.js`: Lógica de formateo.
- `utils.js`: Funciones utilitarias para limpiar y dar formato al código.
- `test/`: Pruebas unitarias.

## Contribuir

¡Las contribuciones son bienvenidas!  
Abre un issue o haz un pull request con tus mejoras.

## Licencia

MIT