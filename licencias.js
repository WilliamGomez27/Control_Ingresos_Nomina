/**
 * Generador CLI Oficial de Licencias de Activación
 * Aplicación: Control de Ingresos Laborales
 * Autor: William Gómez (@WilliamGomez27)
 * 
 * Uso desde la terminal:
 *   node licencias.js TLM-XXXX-YYYY
 */

const LIC_SECRET = "WG-NOMINA-2026-TALMA-PROTECT-KEY-9281";

function calcularClaveActivacion(deviceId) {
    if (!deviceId) return "";
    const cleanId = deviceId.trim().toUpperCase();
    const str = cleanId + ":" + LIC_SECRET;
    let h1 = 0x811c9dc5;
    let h2 = 0x55555555;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x01000193);
        h2 = Math.imul(h2 ^ c, 0x27d4eb2d);
    }
    const part1 = Math.abs(h1).toString(16).toUpperCase().padStart(8, "0");
    const part2 = Math.abs(h2).toString(16).toUpperCase().padStart(8, "0");
    return `ACT-${part1.slice(0, 4)}-${part2.slice(0, 4)}-${part1.slice(4, 8)}`;
}

const args = process.argv.slice(2);
const devId = (args[0] || "").trim().toUpperCase();

console.log("======================================================");
console.log("🔑 GENERADOR OFICIAL DE LICENCIAS · WILLIAM GÓMEZ");
console.log("Control de Ingresos Laborales (Protección Etapa 1 y 2)");
console.log("======================================================");

if (!devId) {
    console.log("⚠️ Uso requerido: node licencias.js <DEVICE_ID>");
    console.log("Ejemplo: node licencias.js TLM-8492-AX7K\n");
    process.exit(1);
}

if (!/^TLM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(devId)) {
    console.log(`⚠️ Advertencia: "${devId}" no cumple el formato estándar TLM-XXXX-YYYY.`);
    console.log("Generando clave de todas formas...\n");
}

const clave = calcularClaveActivacion(devId);
console.log(`📱 Código de Dispositivo: ${devId}`);
console.log(`🔐 Clave de Activación:   ${clave}`);
console.log("------------------------------------------------------");
console.log("💬 Mensaje listo para enviar por WhatsApp:");
console.log(`"Hola! Tu clave de activación para Control de Ingresos Laborales en tu dispositivo (${devId}) es:\n\n${clave}\n\nIngrésala en la aplicación para desbloquear tu acceso."`);
console.log("======================================================\n");
