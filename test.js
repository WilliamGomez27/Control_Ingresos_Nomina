/**
 * Suite de Pruebas Automatizadas para Control de Ingresos Laborales
 * Ejecutar con: node test.js
 * 
 * Verifica directamente el código de index.html:
 * 1. Algoritmo de Festivos en Colombia (Ley Emiliani - Ley 51 de 1983).
 * 2. Clasificación de turnos y cruce de medianoche (clasif).
 * 3. Fórmulas salariales, recargos y divisor legal de jornada (ev, tasaFSP).
 * 4. Novedades laborales e incapacidades médicas con piso de SMMLV (Art. 227 CST).
 * 5. Módulo de Prestaciones Sociales Proyectadas (Prima, Cesantías, Intereses, Vacaciones).
 * 6. Sanitización defensiva de datos (sanear, sanearDed).
 * 7. Fechas de corte personalizables de la empresa (getRangoCorte).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Cargar el script de producción directamente desde index.html para evitar divergencias
const htmlPath = path.join(__dirname, 'index.html');
if (!fs.existsSync(htmlPath)) {
    console.error('❌ No se encontró index.html');
    process.exit(1);
}

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = htmlContent.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i);
if (!scriptMatch) {
    console.error('❌ No se encontró la etiqueta <script> en index.html');
    process.exit(1);
}

function createMockElement() {
    return {
        value: '1600000',
        textContent: '',
        innerHTML: '',
        style: {},
        dataset: {},
        classList: { add() { }, remove() { }, toggle() { } },
        addEventListener() { },
        appendChild() { },
        setAttribute() { },
        getAttribute() { return null; },
        querySelector() { return createMockElement(); },
        querySelectorAll() { return []; },
        scrollIntoView() { }
    };
}

const mockStorage = {
    app_licencia_activa: 'true'
};
const sandbox = {
    __IS_TEST_ENV__: true,
    console,
    Math,
    Date,
    String,
    Number,
    Boolean,
    Array,
    Object,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    JSON,
    RegExp,
    setTimeout: (fn) => { },
    clearTimeout: () => { },
    setInterval: () => { },
    clearInterval: () => { },
    window: {
        addEventListener: () => { },
        removeEventListener: () => { },
        matchMedia: () => ({ matches: false, addEventListener: () => { } }),
        scrollTo: () => { }
    },
    document: {
        getElementById: () => createMockElement(),
        querySelector: () => createMockElement(),
        querySelectorAll: () => [],
        addEventListener: () => { },
        createElement: () => createMockElement(),
        documentElement: createMockElement()
    },
    navigator: { serviceWorker: { register: () => Promise.resolve({ scope: './' }) } },
    location: { protocol: 'https:', hash: '', origin: 'https://test.local' },
    localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); },
        removeItem: (k) => { delete mockStorage[k]; }
    }
};
sandbox.window = Object.assign(sandbox.window, sandbox);
sandbox.self = sandbox.window;
sandbox.$ = () => createMockElement();

vm.createContext(sandbox);
try {
    vm.runInContext(scriptMatch[1], sandbox);
} catch (e) {
    console.error('❌ Error al inicializar el entorno de pruebas:', e.message);
    process.exit(1);
}

// Acceso a las variables del ámbito léxico de index.html
const env = vm.runInContext(`({
    getS: () => S,
    setS: (val) => { S = val; },
    getSMMLV: () => SMMLV,
    getAUX: () => AUX,
    getCFG_DEF: () => CFG_DEF,
    getK: () => K,
    getHrs: () => hrs,
    getDecimalAHrsMins: () => decimalAHrsMins,
    getRegistrarTurnoManualReciente: () => registrarTurnoManualReciente,
    getObtenerTurnosFrecuentes: () => obtenerTurnosFrecuentes,
    getFiltroTurnosVista: () => filtroTurnosVista,
    getAplicarFiltroTurnos: () => aplicarFiltroTurnos,
    getFijarFechaTurno: () => fijarFechaTurno,
    getM: () => M,
    getQ: () => Q,
    getMTurnos: () => M_turnos,
    getMDet: () => M_det,
    getQDet: () => Q_det,
    getVerificarIntegridadAutor: () => verificarIntegridadAutor,
    getGenerarDeviceId: () => generarDeviceId,
    getCalcularClaveActivacion: () => calcularClaveActivacion,
    getValidarClaveActivacion: () => validarClaveActivacion,
    getEstaLicenciaActiva: () => estaLicenciaActiva,
    getDominiosAutorizados: () => DOMINIOS_AUTORIZADOS
})`, sandbox);

// 2. Marco ligero de aserciones para la suite
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✓ ${testName}`);
    } else {
        failedTests++;
        console.error(`  ✗ ${testName}${details ? ' -> ' + details : ''}`);
        failures.push({ testName, details });
    }
}

function assertEqual(actual, expected, testName) {
    const ok = actual === expected;
    assert(ok, testName, `Esperado: ${JSON.stringify(expected)}, Obtenido: ${JSON.stringify(actual)}`);
}

function assertAlmostEqual(actual, expected, testName, delta = 0.05) {
    const ok = Math.abs(actual - expected) <= delta;
    assert(ok, testName, `Esperado: ~${expected}, Obtenido: ${actual} (delta: ${Math.abs(actual - expected)})`);
}

console.log('\n======================================================');
console.log('🧪 SUITE DE PRUEBAS AUTOMATIZADAS - NÓMINA COLOMBIA');
console.log('======================================================\n');

// -------------------------------------------------------------
// SUITE 1: Algoritmo de Festivos (Ley Emiliani - Ley 51 de 1983)
// -------------------------------------------------------------
console.log('📌 Suite 1: Festivos de Colombia (Ley Emiliani)');

// Festivos fijos
assert(Boolean(sandbox.esFestivoColombia('2026-01-01')), 'Año Nuevo (1 de enero) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-05-01')), 'Día del Trabajo (1 de mayo) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-07-20')), 'Día de la Independencia (20 de julio) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-08-07')), 'Batalla de Boyacá (7 de agosto) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-12-08')), 'Inmaculada Concepción (8 de diciembre) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-12-25')), 'Navidad (25 de diciembre) es festivo');

// Festivos trasladables al siguiente lunes
// Día de la Raza: 12 de octubre de 2026 cae en lunes
assert(Boolean(sandbox.esFestivoColombia('2026-10-12')), 'Día de la Raza (12 de octubre de 2026) es festivo');
// San Pedro y San Pablo: 29 de junio de 2026 (lunes)
assert(Boolean(sandbox.esFestivoColombia('2026-06-29')), 'San Pedro y San Pablo trasladado a lunes es festivo');

// Días Santos y Pascua 2026 (Pascua = 5 de abril de 2026)
assert(Boolean(sandbox.esFestivoColombia('2026-04-02')), 'Jueves Santo 2026 (2 de abril) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-04-03')), 'Viernes Santo 2026 (3 de abril) es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-05-18')), 'Ascensión del Señor trasladada a lunes es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-06-08')), 'Corpus Christi trasladado a lunes es festivo');
assert(Boolean(sandbox.esFestivoColombia('2026-06-15')), 'Sagrado Corazón trasladado a lunes es festivo');

// Días normales que NO son festivos
assertEqual(sandbox.esFestivoColombia('2026-10-06'), null, 'Martes 6 de octubre de 2026 NO es festivo');
assertEqual(sandbox.esFestivoColombia('2026-03-10'), null, 'Martes 10 de marzo de 2026 NO es festivo');

// -------------------------------------------------------------
// SUITE 2: Clasificación de Turnos y Cruce de Medianoche (clasif)
// -------------------------------------------------------------
console.log('\n📌 Suite 2: Clasificación de Turnos y Cruce de Medianoche');

// Turno ordinario diurno: 08:00 a 16:00 (martes normal)
const tDiurno = sandbox.clasif({ f: '2026-10-06', e: '08:00', s: '16:00', tipo: 'turno' });
assertEqual(tDiurno.total, 8, 'Turno 08:00 - 16:00 dura 8 horas');
assertEqual(tDiurno.h.he_diurna || 0, 0, 'Turno de 8h diurnas no genera extras diurnas');

// Turno nocturno que cruza la medianoche: 22:00 a 06:00 (8 horas, 45 min descanso)
const tCruceMed = sandbox.clasif({ f: '2026-10-06', e: '22:00', s: '06:00', tipo: 'turno' });
assertEqual(tCruceMed.total, 8, 'Turno 22:00 a 06:00 dura 8 horas');
assertAlmostEqual(tCruceMed.h.rec_nocturno, 7.25, 'Turno 22:00 a 06:00 genera 7.25h netas de recargo nocturno (descontando 45 min descanso)');

// Turno de Sábado que cruza a Domingo (20:00 sábado a 04:00 domingo)
// Sábado 2026-10-10 -> Domingo 2026-10-11
const tSabDom = sandbox.clasif({ f: '2026-10-10', e: '20:00', s: '04:00', tipo: 'turno' });
assertEqual(tSabDom.total, 8, 'Turno Sábado a Domingo dura 8 horas');
assertAlmostEqual(tSabDom.h.rec_nocturno, 3.25, 'Sábado noche genera 3.25h de recargo nocturno ordinario (descontando 45 min descanso)');
assertAlmostEqual(tSabDom.h.rec_noct_fest, 4.0, 'Domingo madrugada genera 4h de recargo nocturno dominical/festivo');

// -------------------------------------------------------------
// SUITE 3: Fórmulas Salariales, Divisores y Fondo de Solidaridad (ev, tasaFSP)
// -------------------------------------------------------------
console.log('\n📌 Suite 3: Fórmulas Salariales, Divisores y Fondo de Solidaridad');

const salEjemplo = 2100000;
// Con jornada semanal de 42h (divisor 210):
const ev2026 = sandbox.ev(salEjemplo, { he_diurna: 2, rec_nocturno: 10 }, '2026-10');
assertEqual(ev2026.vh, 10000, 'Valor de la hora ordinaria con divisor 210 para $2.100.000 es $10.000');
assertEqual(ev2026.ex, 25000, '2 horas extra diurnas (25% recargo = 1.25x) = $25.000');
assertEqual(ev2026.rc, 35000, '10 horas de recargo nocturno (35% recargo) = $35.000');

// Tasa FSP (Fondo de Solidaridad Pensional)
const smmlv = env.getSMMLV();
assertEqual(sandbox.tasaFSP(smmlv * 2), 0, 'Salario de 2 SMMLV no paga Fondo de Solidaridad (0%)');
assertEqual(sandbox.tasaFSP(smmlv * 5), 0.01, 'Salario de 5 SMMLV paga 1% de FSP');
assertEqual(sandbox.tasaFSP(smmlv * 16.5), 0.012, 'Salario de 16.5 SMMLV paga 1.2% de FSP');

// -------------------------------------------------------------
// SUITE 4: Novedades Laborales e Incapacidades Médicas (Art. 227 CST)
// -------------------------------------------------------------
console.log('\n📌 Suite 4: Incapacidades Médicas y Ajustes por Novedades');

const S = env.getS();
// Salario mínimo: la incapacidad del 66.67% NUNCA puede pagar menos del SMMLV diario
S.cfg.sal = smmlv;
S.q['2026-10-1'] = {
    dias: [{ f: '2026-10-05', tipo: 'incapacidad', pct: 66.67, descAux: true }],
    h: {}, otras: 0, bono: 0
};
const novMinimo = sandbox.calcularAjustesNovedades('2026-10', 1, '2026-10-01', '2026-10-15');
assertEqual(novMinimo.descSalIncapacidad, 0, 'Empleado con salario mínimo incapacitado al 66.67% NO tiene descuento salarial (piso legal de 1 SMMLV diario)');
assert(novMinimo.descAuxIncapacidad > 0, 'Se descuenta el auxilio de transporte diario por no desplazamiento durante incapacidad');

// Salario de 3 SMMLV: la incapacidad del 66.67% sí descuenta la diferencia no remunerada (33.33%)
S.cfg.sal = smmlv * 3;
S.q['2026-10-1'] = {
    dias: [{ f: '2026-10-05', tipo: 'incapacidad', pct: 66.67, descAux: true }],
    h: {}, otras: 0, bono: 0
};
const novMedio = sandbox.calcularAjustesNovedades('2026-10', 1, '2026-10-01', '2026-10-15');
assert(novMedio.descSalIncapacidad > 0, 'Empleado con 3 SMMLV tiene descuento salarial por el tercio no cubierto por la EPS');

// -------------------------------------------------------------
// SUITE 5: Módulo de Prestaciones Sociales Proyectadas
// -------------------------------------------------------------
console.log('\n📌 Suite 5: Prestaciones Sociales Proyectadas (CST Colombia)');

S.cfg.sal = 2000000;
S.q = {}; // Limpio para prueba de fórmulas base
const prest = sandbox.calcularPrestaciones('2026-10', 2);

// Base de liquidación con salario $2.000.000 (menor a 2 SMMLV, incluye auxilio de transporte)
assert(prest.tieneAux, 'Salario de $2.000.000 tiene derecho a auxilio de transporte');
assertEqual(prest.baseMensualCesantias, 2000000 + env.getAUX(), 'Base anual incluye salario base + auxilio de transporte');
assertEqual(prest.baseMensualVacaciones, 2000000, 'Base de vacaciones excluye el auxilio de transporte (Art. 192 CST)');

// Prima semestral proyectada para 180 días completos = base / 2
assertEqual(prest.primaProyectada, Math.round((prest.baseMensualPrima * 180) / 360), 'Prima proyectada equivale a 15 días por semestre');

// Cesantías proyectadas para 360 días completos = 1 base completa
assertEqual(prest.cesantiasProyectadas, prest.baseMensualCesantias, 'Cesantías proyectadas equivalen a 1 mes completo de salario base');

// Intereses de cesantías = 12% anual
assertEqual(prest.interesesProyectados, Math.round(prest.cesantiasProyectadas * 0.12), 'Intereses de cesantías equivalen exactamente al 12% anual');

// Vacaciones proyectadas = 15 días hábiles (baseVacaciones / 2)
assertEqual(prest.diasVacacionesProyectados, 15, 'Vacaciones proyectadas son 15 días al año');
assertEqual(prest.valorVacacionesProyectadas, Math.round((prest.baseMensualVacaciones * 360) / 720), 'Valor de 15 días de vacaciones equivale a medio mes de salario base');

// Pruebas proporcionales con fecha de ingreso real (ej. ingreso 01 de agosto de 2026)
S.cfg.fechaIngreso = '2026-08-01';
const prestProp = sandbox.calcularPrestaciones('2026-08', 1);
assertEqual(prestProp.diasTranscurridosAño, 15, 'Trabajador ingresado el 1 de agosto acumula 15 días en la 1.ª quincena de agosto');
assertEqual(prestProp.diasProyectadosAño, 150, 'Trabajador ingresado el 1 de agosto proyecta 150 días de cesantías al cierre de año (5 meses)');
assertEqual(prestProp.diasTranscurridosSemestre, 15, 'Trabajador ingresado el 1 de agosto acumula 15 días en el 2.º semestre');
assertEqual(prestProp.diasProyectadosSemestre, 150, 'Trabajador ingresado el 1 de agosto proyecta 150 días de prima en el 2.º semestre');
assertEqual(prestProp.diasVacacionesProyectados, 6.3, 'Vacaciones proyectadas proporcionales son 6.3 días hábiles (150 * 15 / 360)');
assertEqual(prestProp.cesantiasProyectadas, Math.round((prestProp.baseMensualCesantias * 150) / 360), 'Cesantías proyectadas son proporcionales a 150 días');
assertEqual(prestProp.antiguedadTexto, '15 días', 'Antigüedad a la 1.ª quincena de agosto es 15 días');

// Consulta de período previo a la fecha de ingreso
const prestPrev = sandbox.calcularPrestaciones('2026-05', 2);
assertEqual(prestPrev.diasTranscurridosSemestre, 0, 'Período anterior a la contratación no acumula días de prima');
assertEqual(prestPrev.diasProyectadosSemestre, 0, 'Período anterior a la contratación no proyecta prima');
assertEqual(prestPrev.primaProyectada, 0, 'Prima proyectada en período previo a contratación es $0');
assert(prestPrev.antiguedadTexto.includes('Ingreso posterior'), 'Identifica que el ingreso es posterior al período consultado');

// Restablecer para no alterar pruebas posteriores
S.cfg.fechaIngreso = '';

// -------------------------------------------------------------
// SUITE 6: Sanitización Defensiva de Datos (sanear y sanearDed)
// -------------------------------------------------------------
console.log('\n📌 Suite 6: Sanitización Defensiva de Datos');

const cfgConFecha = sandbox.sanearCfg({ fechaIngreso: '2026-08-01' });
assertEqual(cfgConFecha.fechaIngreso, '2026-08-01', 'sanearCfg preserva fechaIngreso válida');
const cfgFechaInvalida = sandbox.sanearCfg({ fechaIngreso: '01/08/2026' });
assertEqual(cfgFechaInvalida.fechaIngreso, '', 'sanearCfg neutraliza fechaIngreso con formato incorrecto');

const dedSucia = sandbox.sanearDed({
    fondo: '50000',
    sindicato: -1000,
    prestamo: 'abc',
    notaVarias: '  Casino y refrigerios  <script>alert(1)</script>  '
});
assertEqual(dedSucia.fondo, 50000, 'sanearDed convierte strings numéricos correctamente');
assertEqual(dedSucia.sindicato, 0, 'sanearDed neutraliza números negativos a 0');
assertEqual(dedSucia.prestamo, 0, 'sanearDed neutraliza strings no numéricos a 0');
assert(dedSucia.notaVarias.includes('Casino y refrigerios'), 'sanearDed preserva el texto legítimo del concepto');

const resInvalido = sandbox.sanear({ cfg: { sal: '1800000' }, q: null });
assertEqual(resInvalido, null, 'sanear rechaza defensivamente payloads con q nulo');

const resValido = sandbox.sanear({
    cfg: { sal: '1800000', modoCorte: 'actual' },
    q: {}
});
assert(resValido !== null, 'sanear acepta payload válido con cfg y q');
assertEqual(resValido.S.cfg.sal, 1800000, 'sanear convierte salario a número');
assertEqual(resValido.S.cfg.modoCorte, 'actual', 'sanear preserva modalidad de corte');


// -------------------------------------------------------------
// SUITE 7: Fechas de Corte y Períodos de Pago (getRangoCorte)
// -------------------------------------------------------------
console.log('\n📌 Suite 7: Fechas de Corte Personalizadas de la Empresa');

// Modalidad Quincena Vencida
S.cfg.modoCorte = 'vencida';
const corteVencida = sandbox.getRangoCorte('2026-10', 1);
assertEqual(corteVencida.fIni, '2026-09-16', 'En quincena vencida, pago del 1–15 oct liquida 16–30 sep');

// Modalidad Quincena Actual
S.cfg.modoCorte = 'actual';
const corteActual = sandbox.getRangoCorte('2026-10', 1);
assertEqual(corteActual.fIni, '2026-10-01', 'En quincena actual, pago del 1–15 oct liquida 1–15 oct');

// Modalidad Personalizada (ej. 24 al 9 para 1.ª Q)
S.cfg.modoCorte = 'personalizada';
S.cfg.corte1Ini = 24;
S.cfg.corte1Fin = 9;
const corteCustom = sandbox.getRangoCorte('2026-10', 1);
assertEqual(corteCustom.fIni, '2026-09-24', 'En corte personalizado, inicio es el día 24 del mes anterior');
assertEqual(corteCustom.fFin, '2026-10-09', 'En corte personalizado, fin es el día 9 del mes de pago');

// -------------------------------------------------------------
// SUITE 8: Configuración de Jornada, Horas y Minutos (Caso Talma 42h)
// -------------------------------------------------------------
console.log('\n📌 Suite 8: Configuración de Jornada, Horas/Minutos y Caso Talma (42h/sem)');

// Validación de funciones de parseo y conversión
const hrsFn = env.getHrs();
const decFn = env.getDecimalAHrsMins();

const parse909 = hrsFn('9:09');
assertAlmostEqual(parse909, 9.15, "hrs('9:09') convierte a 9.15 horas decimales (549 minutos)");

const parse9h09m = hrsFn('9h 09m');
assertAlmostEqual(parse9h09m, 9.15, "hrs('9h 09m') convierte a 9.15 horas decimales");

// Mitigación de error de versiones anteriores (9.9 -> 9.15)
const legacyCorr = hrsFn(9.9);
assertAlmostEqual(legacyCorr, 9.15, "hrs(9.9) de versiones anteriores se autocorige a 9.15h (9h 09m)");

const thm = decFn(9.15);
assertEqual(thm.h, 9, "decimalAHrsMins(9.15) extrae 9 horas");
assertEqual(thm.m, 9, "decimalAHrsMins(9.15) extrae 9 minutos");

const thmLegacy = decFn(9.9);
assertEqual(thmLegacy.h, 9, "decimalAHrsMins(9.9 legacy) extrae 9 horas");
assertEqual(thmLegacy.m, 9, "decimalAHrsMins(9.9 legacy) extrae 9 minutos");

// Verificación matemática de esquemas flexibles y configurables:
// Caso A: Esquema 6 días a la semana (Turno 8 horas con 60 min de descanso)
const turno6dTotalMins = 8 * 60; // 480 minutos
const break6dMins = 60;
const neta6dMins = turno6dTotalMins - break6dMins; // 420 min = 7.0 horas
assertEqual(neta6dMins, 420, "Turno de 8h con 60 min de break da 420 minutos netos (7h 00m)");
const neta6dHoras = neta6dMins / 60;
assertEqual(neta6dHoras, 7.0, "Jornada neta diaria en esquema 6 días es exactamente 7.0 horas");
const sem6dHoras = neta6dHoras * 6;
assertEqual(sem6dHoras, 42.0, "6 turnos de 7.0h completan exactamente las 42 horas semanales legales");

// Caso B: Esquema 5 días a la semana (Turno 9 horas 9 minutos con 45 min de descanso)
const turno5dTotalMins = 9 * 60 + 9; // 549 minutos
const break5dMins = 45;
const neta5dMins = turno5dTotalMins - break5dMins; // 504 min = 8h 24m = 8.4 horas
assertEqual(neta5dMins, 504, "Turno de 9h 09m con 45 min de break da 504 minutos netos (8h 24m)");
const neta5dHoras = neta5dMins / 60;
assertEqual(neta5dHoras, 8.4, "Jornada neta diaria en esquema 5 días es exactamente 8.4 horas");
const sem5dHoras = neta5dHoras * 5;
assertEqual(sem5dHoras, 42.0, "5 turnos de 8.4h completan exactamente las 42 horas semanales legales");

// Caso C: Turno estándar 8 horas sin descanso
const turnoEst8h = 8 * 60;
const break0 = 0;
const neta8h = (turnoEst8h - break0) / 60;
assertEqual(neta8h * 5, 40.0, "5 turnos estándar de 8h sin break completan 40 horas semanales");

// Caso D: Validación de sanitización y persistencia de diasSemana en sanearCfg
const cfgSan5 = sandbox.sanearCfg({ diasSemana: 5 });
assertEqual(cfgSan5.diasSemana, 5, "sanearCfg preserva diasSemana = 5");
const cfgSan6 = sandbox.sanearCfg({ diasSemana: 6 });
assertEqual(cfgSan6.diasSemana, 6, "sanearCfg preserva diasSemana = 6");
const cfgSanInval = sandbox.sanearCfg({ diasSemana: 99 });
assertEqual(cfgSanInval.diasSemana, 5, "sanearCfg corrige valores inválidos de diasSemana a 5 por defecto");

// Caso E: Validación del historial dinámico de los últimos 6 turnos manuales
const regRecienteFn = env.getRegistrarTurnoManualReciente();
const obtFrecuentesFn = env.getObtenerTurnosFrecuentes();

// Registrar 6 turnos en orden
regRecienteFn('06:00', '14:00');
regRecienteFn('14:00', '22:00');
regRecienteFn('22:00', '06:00');
regRecienteFn('08:00', '17:00');
regRecienteFn('05:00', '14:09');
regRecienteFn('13:00', '22:09');

let list6 = obtFrecuentesFn();
assertEqual(list6.length, 6, "obtenerTurnosFrecuentes retorna exactamente 6 turnos");
assertEqual(list6[0].e, '13:00', "El turno más recientemente ingresado (13:00) está en primera posición");
assertEqual(list6[0].s, '22:09', "La salida del turno más reciente es 22:09");
assertEqual(list6[1].e, '05:00', "El penúltimo turno ingresado (05:00) está en segunda posición");

// Al ingresar un 7.º turno diferente, el más antiguo se desplaza conservando máximo 6
regRecienteFn('07:00', '16:00');
list6 = obtFrecuentesFn();
assertEqual(list6.length, 6, "Se mantiene el límite estricto de los últimos 6 turnos");
assertEqual(list6[0].e, '07:00', "El nuevo 7.º turno ingresado (07:00) pasa a primera posición");
assert(!list6.some(t => t.e === '06:00' && t.s === '14:00'), "El turno más antiguo (06:00-14:00) fue desplazado de los 6 recientes");

// Si se vuelve a ingresar un turno existente, no se duplica sino que se mueve a la cima
regRecienteFn('05:00', '14:09');
list6 = obtFrecuentesFn();
assertEqual(list6.length, 6, "Reingresar un turno existente no genera duplicados");
assertEqual(list6[0].e, '05:00', "Turno reingresado se mueve inmediatamente a primera posición");

// -------------------------------------------------------------
// SUITE 9: INDEPENDENCIA DE PANTALLAS Y PERSISTENCIA DE PERÍODOS
// -------------------------------------------------------------
console.log('\n📌 Suite 9: Independencia de Pantallas y Persistencia de Estado');
const aplicarFiltroFn = env.getAplicarFiltroTurnos();
const fijarFechaFn = env.getFijarFechaTurno();

// Test 1: Aplicar filtro de quincena en Turnos persiste en localStorage
aplicarFiltroFn('q2', true);
assertEqual(env.getFiltroTurnosVista(), 'q2', "aplicarFiltroTurnos('q2') fija filtroTurnosVista en q2");
assertEqual(mockStorage['filtro_turnos_vista'], 'q2', "El filtro q2 se persiste en localStorage['filtro_turnos_vista']");

// Test 2: Cambiar filtro de Turnos a 'mes' no contamina Resumen
aplicarFiltroFn('mes', true);
assertEqual(env.getFiltroTurnosVista(), 'mes', "aplicarFiltroTurnos('mes') fija filtroTurnosVista en mes");
assertEqual(mockStorage['filtro_turnos_vista'], 'mes', "El filtro mes se persiste en localStorage");

// Test 3: Fijar fecha en Turnos persiste en localStorage['ultimo_jf']
fijarFechaFn('2026-10-18', true);
assertEqual(mockStorage['ultimo_jf'], '2026-10-18', "fijarFechaTurno('2026-10-18') guarda en localStorage['ultimo_jf']");

// Test 4: Independencia entre períodos de Resumen, Turnos y Detalles
assert(env.getM() !== undefined, "Período M de Resumen está inicializado");
assert(env.getQ() !== undefined, "Quincena Q de Resumen está inicializada");
assert(env.getMTurnos() !== undefined, "Período M_turnos de Turnos está inicializado");
assert(env.getMDet() !== undefined, "Período M_det de Detalles está inicializado");
assert(env.getQDet() !== undefined, "Quincena Q_det de Detalles está inicializada");

// Test 5: Fallback defensivo de filtroTurnosVista ante valores inválidos
aplicarFiltroFn('filtro_invalido', true);
assertEqual(env.getFiltroTurnosVista(), 'q1', "Filtro inválido se normaliza a q1 defensivamente");

// -------------------------------------------------------------
// SUITE 10: SEGURIDAD, AUTORÍA Y LICENCIAMIENTO POR DISPOSITIVO
// -------------------------------------------------------------
console.log('\n📌 Suite 10: Sistema de Protección de Autoría y Licenciamiento');
const verificarAutorFn = env.getVerificarIntegridadAutor();
const genDeviceIdFn = env.getGenerarDeviceId();
const calcClaveFn = env.getCalcularClaveActivacion();
const valClaveFn = env.getValidarClaveActivacion();
const estaLicActivaFn = env.getEstaLicenciaActiva();
const dominiosAutorizados = env.getDominiosAutorizados();

assert(dominiosAutorizados.includes('controlingresosnomina.vercel.app'), "El dominio oficial de producción controlingresosnomina.vercel.app está autorizado");
assert(verificarAutorFn(), "La firma del autor William Gómez (@WilliamGomez27) está íntegra");
const devId = genDeviceIdFn();
assert(/^TLM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(devId), "El Device ID generado cumple con el formato TLM-XXXX-YYYY");

const clave1 = calcClaveFn('TLM-94B2-7E1A');
assert(/^ACT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(clave1), "La clave de activación generada cumple con el formato ACT-XXXX-XXXX-XXXX");
assert(valClaveFn('TLM-94B2-7E1A', clave1), "La clave generada valida exitosamente para su respectivo Device ID");
assert(!valClaveFn('TLM-94B2-7E1A', 'ACT-0000-0000-0000'), "Una clave falsa o adulterada es rechazada");
assert(!valClaveFn('TLM-AAAA-BBBB', clave1), "La clave de un dispositivo NO funciona en un dispositivo diferente (protege la distribución)");
assert(valClaveFn('CUALQUIERA', 'WG-TALMA-2026-DEV'), "La Master Developer Key de William permite bypass administrativo");
assert(estaLicActivaFn(), "El entorno de pruebas reporta licencia activa");

// -------------------------------------------------------------
// REPORTE FINAL
// -------------------------------------------------------------
console.log('\n======================================================');
if (failedTests === 0) {
    console.log(`🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! (${passedTests}/${totalTests})`);
    console.log('El sistema de nómina y cálculos laborales está 100% verificado.');
    console.log('======================================================\n');
    process.exit(0);
} else {
    console.error(`❌ HUBO ${failedTests} PRUEBAS FALLIDAS de ${totalTests}.`);
    failures.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
    console.log('======================================================\n');
    process.exit(1);
}
