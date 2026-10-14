# Control de ingresos laborales (Colombia)

[![GitHub Pages](https://img.shields.io/badge/App%20en%20vivo-GitHub%20Pages-success?style=flat-square&logo=github)](https://williamgomez27.github.io/Control_ingresos_Nomina/)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline-blue?style=flat-square&logo=pwa)](https://williamgomez27.github.io/Control_ingresos_Nomina/)
[![Licencia](https://img.shields.io/badge/Uso-Personal%20y%20Laboral-informational?style=flat-square)](https://github.com/WilliamGomez27/Control_ingresos_Nomina)

Aplicación web progresiva (PWA) de una sola página diseñada para llevar el control detallado, transparente y automático de los ingresos de un trabajador con pago quincenal en Colombia.

Calcula el neto estimado de cada quincena, clasifica automáticamente las horas ordinarias, recargos nocturnos, festivos y horas extra, detecta domingos y días festivos oficiales de Colombia (Ley Emiliani), liquida el auxilio de transporte por ley y guarda todo el historial en tu propio dispositivo de manera **100% privada y offline**.

👉 **Accede a la aplicación en vivo:** [https://williamgomez27.github.io/Control_ingresos_Nomina/](https://williamgomez27.github.io/Control_ingresos_Nomina/)

---

## 🌟 Novedades y Características Principales

- **📱 Diseño 100% Responsivo Móvil:** Adaptada perfectamente a pantallas de celulares (desde 360px de ancho) sin necesidad de activar el "modo navegador / vista de escritorio". Incluye tipografía táctil a 16px para evitar el zoom involuntario de iOS y Android.
- **💾 Persistencia Inteligente de Período:** Al cerrar y reiniciar el navegador, la aplicación recuerda automáticamente la última quincena en la que trabajaste o te posiciona en el período más reciente con datos registrados. ¡Nunca más verás una quincena en blanco por error!
- **📲 Soporte PWA Oficial (Instalación Nativa):** Cuenta con `manifest.json` y Service Worker (`sw.js`) con soporte de caché. Al abrirla desde GitHub Pages, el navegador activa automáticamente la opción **"Instalar aplicación"** en el menú de los 3 puntos (o el botón en la barra de direcciones).
- **📅 Registro de Novedades y Ajustes de Nómina (Pantalla Turnos):**
  - 🏖️ **Días de Descanso Remunerado:** Días libres o compensatorios que forman parte del salario pactado ($0 descuento).
  - 🚫 **Ausencias No Remuneradas:** Descuenta proporcionalmente los días de salario básico (`salario ÷ 30`) y el auxilio de transporte por no desplazamiento (`auxilio ÷ 30`).
  - 🩺 **Incapacidades Médicas:** Liquidación conforme a la ley colombiana con opción de 66.67% (con piso constitucional de 1 SMMLV diario para proteger el ingreso mínimo) o 100% (origen laboral / ARL o empresa), ajustando automáticamente el salario ordinario y el auxilio de transporte correspondiente.
  - Soporte de **rango de fechas** para registrar incapacidades o descansos de varios días con un solo clic.
- **🔄 Sincronización Multidispositivo Mejorada (WhatsApp / QR / Nube):**
  - **Por Código:** Nuevo botón **📲 Enviar por WhatsApp** que protege el código dentro de un bloque monospaciado (` ``` `) para que WhatsApp no altere caracteres ni guiones bajos.
  - **Pegado Rápido:** Botón **📋 Pegar del portapapeles** para insertar el código transferido en 1 toque.
  - **Autodetección:** El sistema reconoce automáticamente si el código es GZIP comprimido, Base64 o JSON plano, limpiando cualquier encabezado de chat.
  - **Código QR:** Escanea y transfiere turnos entre tu computadora y tu celular.
  - **Nube Privada:** Respaldo y sincronización automática usando tu propia cuenta de GitHub Gist.
- **🇨🇴 Detección Automática de Festivos de Colombia:** Algoritmo integrado con la Ley Emiliani y cálculo astronómico de Pascua para detectar festivos oficiales y domingos sin necesidad de marcarlos manualmente.
- **🌙 Recargos Automáticos de Turnos:** *Nocturno (35%)*, *Dominical/Festivo (90% según reforma)* y *Nocturno Festivo (125%)* se acumulan automáticamente desde los horarios registrados.
- **📄 Volante de Pago y Copia de Seguridad:** Copia en formato WhatsApp el desglose salarial, exporta a Excel en formato CSV en español (separador punto y coma, UTF-8 con BOM) o descarga respaldos completos en formato JSON.
- **🗓️ Calendario Compacto de la Quincena (Pantalla Turnos):** Los 15 días caben en una sola vista, con colores por tipo (turno, descanso, ausencia, incapacidad). Toca un día para registrarlo o editarlo. Para cargar rápido, escribe solo la hora de entrada: la salida se completa sola y el formulario pasa al día siguiente. El detalle día por día queda plegado.
- **💾 Guardado Explícito de Horas Extra Manuales:** Botón **Guardar horas extra** o tecla **Enter**, con confirmación visible (hora y detalle guardado) y aviso de "cambios sin guardar".
- **🎨 Resumen con Colores por Concepto:** Las casillas usan los mismos colores de la barra de devengado (salario azul, extras y recargos verde, auxilio turquesa, deducciones rojo).
- **🛡️ Reapertura Robusta:** Además de la quincena, recuerda la pestaña y la casilla que estabas viendo; guarda al pasar la app a segundo plano; y si el navegador bloquea el almacenamiento o ocurre un error inesperado, muestra un aviso con el detalle en lugar de dejar la pantalla a medias.

---

## 📊 Reglas de Liquidación y Cálculo

| Concepto | Regla y Base Legal |
|---|---|
| **Valor de la hora ordinaria** | Salario mensual ÷ Divisor (210 h para jornada de 42 h semanales, configurable a 220h, 230h o 240h) |
| **Salario del pago (nominal)** | Salario mensual ÷ 2 |
| **Día de descanso remunerado** | Incluido al 100% en el salario ordinario ($0 descuento de nómina) |
| **Día de ausencia no remunerada** | Descuenta `salario ÷ 30` en salario básico y `auxilio ÷ 30` en auxilio de transporte |
| **Incapacidad médica (General 66.67%)** | Reconoce 66.67% diario con **piso legal de 1 SMMLV diario** (`SMMLV ÷ 30`). Descuenta el ajuste en salario y el auxilio de transporte por no desplazamiento |
| **Incapacidad médica (Laboral 100%)** | Reconoce el 100% del valor día (`salario ÷ 30`). Descuenta auxilio de transporte por no desplazamiento |
| **Auxilio de transporte legal** | La mitad del auxilio mensual en cada quincena si el salario ≤ 2 SMMLV, ajustado por días no laborados |
| **Recargo nocturno** | +35 % sobre la hora ordinaria (configurable a las 19:00 o 20:00 según empresa) |
| **Recargo dominical y festivo** | +90 % sobre la hora ordinaria (vigente desde julio de 2026) |
| **Recargo nocturno festivo** | +35 % + 90 % (+125 %) |
| **Hora extra diurna** | Hora ordinaria + 25 % |
| **Hora extra nocturna** | Hora ordinaria + 75 % |
| **Horas extra dominicales y festivas** | Se suma el 90 % al recargo de la hora extra |
| **Salud y pensión** | 4 % y 4 % de la base real de cotización del pago |
| **Fondo de solidaridad** | Progresivo (1 % a 2 %) según el IBC mensual (a partir de 4 SMMLV) |
| **Neto estimado a pagar** | Salario ajustado + Extras + Recargos + Bonificación + Auxilio ajustado − Deducciones |

---

## 📲 Cómo Instalar la Aplicación en tu Dispositivo

### 1. Desde GitHub Pages (Recomendado para celulares y PC)
Al abrir la app en [https://williamgomez27.github.io/Control_ingresos_Nomina/](https://williamgomez27.github.io/Control_ingresos_Nomina/):

- **En Android (Chrome / Edge):** Toca los **tres puntos (⋮)** en la esquina superior y pulsa **"Instalar aplicación"** o **"Agregar a la pantalla principal"** (o presiona el botón **📲 Instalar** en la barra superior).
- **En iPhone / iPad (Safari):** Pulsa el botón **Compartir** (cuadrado con flecha hacia arriba ⬆️) y selecciona **"Agregar al inicio" (Add to Home Screen ➕)**.
- **En PC (Chrome / Edge / Brave):** Haz clic en el icono de instalación **💻⊕** en la barra de direcciones o en el menú **(⋮) → Instalar Control de Ingresos Laborales**.

### 2. Desde Archivo Local en la Computadora (`file:///`)
Si ejecutas el archivo HTML directamente desde tu disco duro sin internet:
- Ve a la pestaña **Ajustes → Instalación y Acceso Directo**.
- Haz clic en **"📥 Descargar Acceso Directo (.url)"**.
- Arrastra el archivo descargado a tu Escritorio para abrir la aplicación con un doble clic.

---

## 🛠️ Estructura del Proyecto

```text
Control_ingresos_Nomina/
├── index.html                     # Archivo principal para GitHub Pages y uso web
├── Control de Ingresos_Talma.html  # Archivo espejo idéntico para uso local
├── manifest.json                  # Manifiesto oficial PWA (iconos, temas, inicio)
├── sw.js                          # Service Worker (red primero; sin conexión usa la copia guardada)
├── README.md                      # Documentación completa del proyecto
└── SECURITY.md                    # Política de seguridad del repositorio
```

---

## 🔒 Privacidad y Almacenamiento

- **100% Privado:** Tus jornadas, horas y salarios **nunca salen de tu dispositivo** a servidores de terceros ni analíticas.
- **Sin Dependencias Externas:** No requiere librerías remotas, CDNs ni servicios de pago; todo el código se ejecuta de forma nativa en tu navegador.
- **Copias de Seguridad Fáciles:** Puedes respaldar todos tus datos en cualquier momento descargando tu archivo JSON desde **Ajustes → Copia de Seguridad**.
