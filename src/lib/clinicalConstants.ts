export interface ClinicalRange {
    min: number;
    max: number;
    label: string;
}

export interface SpeciesConstants {
    temp: ClinicalRange;
    fc: ClinicalRange;
    fr: ClinicalRange;
    tpc: { label: string };
}

export const CLINICAL_CONSTANTS: Record<string, SpeciesConstants> = {
    'canino': {
        temp: { min: 37.5, max: 39.2, label: '37.5 - 39.2 °C' },
        fc: { min: 70, max: 160, label: '70 - 160 bpm' },
        fr: { min: 10, max: 30, label: '10 - 30 mpm' },
        tpc: { label: '< 2s' },
    },
    'felino': {
        temp: { min: 37.8, max: 39.2, label: '37.8 - 39.2 °C' },
        fc: { min: 160, max: 240, label: '160 - 240 bpm' },
        fr: { min: 20, max: 40, label: '20 - 40 mpm' },
        tpc: { label: '< 2s' },
    },
    'lagomorfo': {
        temp: { min: 38.5, max: 40.0, label: '38.5 - 40.0 °C' },
        fc: { min: 130, max: 325, label: '130 - 325 bpm' },
        fr: { min: 30, max: 60, label: '30 - 60 mpm' },
        tpc: { label: '< 2s' },
    },
    'roedor': {
        temp: { min: 36.0, max: 39.0, label: '36.0 - 39.0 °C' },
        fc: { min: 250, max: 600, label: '250 - 600 bpm' },
        fr: { min: 35, max: 135, label: '35 - 135 mpm' },
        tpc: { label: '< 2s' },
    },
    'ave': {
        temp: { min: 39.0, max: 42.0, label: '39.0 - 42.0 °C' },
        fc: { min: 150, max: 400, label: '150 - 400 bpm' },
        fr: { min: 15, max: 60, label: '15 - 60 mpm' },
        tpc: { label: '< 2s' },
    },
    'reptil': {
        temp: { min: 25.0, max: 35.0, label: '25.0 - 35.0 °C (Variável)' },
        fc: { min: 20, max: 60, label: '20 - 60 bpm (Variável)' },
        fr: { min: 4, max: 15, label: '4 - 15 mpm (Variável)' },
        tpc: { label: '< 2s (Variável)' },
    },
    'silvestre': {
        temp: { min: 36.0, max: 40.0, label: '36.0 - 40.0 °C' },
        fc: { min: 100, max: 300, label: '100 - 300 bpm' },
        fr: { min: 20, max: 80, label: '20 - 80 mpm' },
        tpc: { label: '< 2s' },
    },
    'outro': {
        temp: { min: 37.0, max: 39.5, label: '37.0 - 39.5 °C' },
        fc: { min: 60, max: 200, label: '60 - 200 bpm' },
        fr: { min: 10, max: 40, label: '10 - 40 mpm' },
        tpc: { label: '< 2s' },
    },
};

export function getClinicalConstants(species: string = ''): SpeciesConstants {
    const s = species.toLowerCase();

    // Exact match
    if (CLINICAL_CONSTANTS[s]) return CLINICAL_CONSTANTS[s];

    // Partial matches or categories
    if (s.includes('cão') || s.includes('cachorro') || s.includes('canino')) return CLINICAL_CONSTANTS['canino'];
    if (s.includes('gato') || s.includes('felino')) return CLINICAL_CONSTANTS['felino'];
    if (s.includes('coelho') || s.includes('lagomorfo')) return CLINICAL_CONSTANTS['lagomorfo'];
    if (s.includes('roedor') || s.includes('rato') || s.includes('hamster') || s.includes('porquinho')) return CLINICAL_CONSTANTS['roedor'];
    if (s.includes('ave') || s.includes('pássaro') || s.includes('calopsita') || s.includes('papagaio')) return CLINICAL_CONSTANTS['ave'];
    if (s.includes('reptil') || s.includes('réptil') || s.includes('cobra') || s.includes('jabuti')) return CLINICAL_CONSTANTS['reptil'];
    if (s.includes('silvestre')) return CLINICAL_CONSTANTS['silvestre'];

    return CLINICAL_CONSTANTS['outro'];
}

export function isOutOfRange(value: string | number, range: ClinicalRange): boolean {
    const val = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(val)) return false;
    return val < range.min || val > range.max;
}
