# Política de Seguridad y Privacidad

## 🛡️ Modelo de Privacidad y Procesamiento de Datos

**Control de Ingresos Laborales** está diseñado bajo una arquitectura de **privacidad absoluta por diseño (*Privacy by Design*)**:

1. **Ejecución 100% Local (Client-Side):** Todo el cómputo de nómina, cálculo de horas extras, recargos y festivos se ejecuta de manera nativa en el navegador del usuario.
2. **Sin Servidores Intermedios:** La aplicación no cuenta con base de datos remota, analíticas de terceros ni servidores que recopilen datos personales o salariales.
3. **Almacenamiento Local Seguro:** La información de los turnos y configuraciones se guarda únicamente en el `localStorage` del dispositivo del usuario.

---

## 🔑 Recomendaciones de Seguridad para la Sincronización en la Nube

Si utilizas la sincronización opcional con **GitHub Gist**:
- **Alcance mínimo:** Te recomendamos crear un **Fine-Grained Personal Access Token** en GitHub que solo tenga permisos de lectura y escritura en `Gists` (sin permisos sobre tus repositorios o código personal).
- **Dispositivos compartidos:** Si accedes a la aplicación desde una computadora pública o compartida, asegúrate de borrar tus datos o cerrar sesión mediante el botón *«Borrar todos los datos y reiniciar»* en la pestaña de Ajustes antes de cerrar el navegador.

---

## 📦 Versiones Soportadas

| Versión / Rama | Estado de Soporte |
|---|---|
| `main` (Producción en GitHub Pages) | :white_check_mark: Soporte activo y corrección de bugs |
| Archivo offline local (`index.html`) | :white_check_mark: Soporte activo |

---

## 🚨 Reporte de Vulnerabilidades o Problemas de Seguridad

Si descubres una vulnerabilidad o fallo de seguridad:
1. Por favor **no** la publiques de forma abierta en foros públicos.
2. Abre un issue confidencial o repórtalo en el repositorio oficial: [https://github.com/WilliamGomez27/Control_ingresos_Nomina/issues](https://github.com/WilliamGomez27/Control_ingresos_Nomina/issues)
3. Describe los pasos necesarios para reproducir el fallo y el impacto potencial.

Las incidencias de seguridad serán revisadas y corregidas a la mayor brevedad.
