import { FILLED_POLE_ICONS, type FilledIcon } from './filledPoleIcons';
import type { Religion, ReligionChoice } from '../utils/religion';

// Ícones de cada religião: alternativas da pergunta de religião e polo
// "Religioso" no resultado/card quando o usuário escolheu uma religião.
export const RELIGION_ICONS: Record<Religion | ReligionChoice | 'none', FilledIcon> = {
  // Católico: a mesma cruz padrão do polo "Religioso" do eixo religião (só a ortodoxa se diferencia).
  catholic: {
    viewBox: '0 0 768 1024',
    fillRule: 'nonzero',
    paths: [
      'M704 512H512v448q0 26-18.5 45t-45.5 19H320q-26 0-45-19t-19-45V512H64q-26 0-45-19T0 448V320q0-27 18.5-45.5T64 256h192V64q0-27 19-45.5T320 0h128q27 0 45.5 18.5T512 64v192h192q27 0 45.5 18.5T768 320v128q0 26-18.5 45T704 512'
    ]
  },
  // Protestante: a cruz padrão do polo "Religioso" do eixo religião.
  protestant: {
    viewBox: '0 0 768 1024',
    fillRule: 'nonzero',
    paths: [
      'M704 512H512v448q0 26-18.5 45t-45.5 19H320q-26 0-45-19t-19-45V512H64q-26 0-45-19T0 448V320q0-27 18.5-45.5T64 256h192V64q0-27 19-45.5T320 0h128q27 0 45.5 18.5T512 64v192h192q27 0 45.5 18.5T768 320v128q0 26-18.5 45T704 512'
    ]
  },
  // Ortodoxo: cruz ortodoxa russa (três travas, a de baixo inclinada).
  orthodox: {
    viewBox: '0 0 16 16',
    fillRule: 'nonzero',
    paths: ['M7.5 1c-.277 0-.5.223-.5.5V3H5.5c-.277 0-.5.223-.5.5v1c0 .277.223.5.5.5H7v1H3.5c-.277 0-.5.223-.5.5v1c0 .277.223.5.5.5H7v2.188l-1.156-.313a.525.525 0 0 0-.625.375l-.25.969a.474.474 0 0 0 .343.594L7 12.28v2.22c0 .277.223.5.5.5h1c.277 0 .5-.223.5-.5v-1.687l1.156.312a.525.525 0 0 0 .625-.375l.25-.969a.474.474 0 0 0-.344-.594L9 10.72V8h3.5c.277 0 .5-.223.5-.5v-1c0-.277-.223-.5-.5-.5H9V5h1.5c.277 0 .5-.223.5-.5v-1c0-.277-.223-.5-.5-.5H9V1.5c0-.277-.223-.5-.5-.5z']
  },
  christianity: {
    viewBox: '0 0 768 1024',
    fillRule: 'nonzero',
    paths: [
      'M704 512H512v448q0 26-18.5 45t-45.5 19H320q-26 0-45-19t-19-45V512H64q-26 0-45-19T0 448V320q0-27 18.5-45.5T64 256h192V64q0-27 19-45.5T320 0h128q27 0 45.5 18.5T512 64v192h192q27 0 45.5 18.5T768 320v128q0 26-18.5 45T704 512'
    ]
  },
  judaism: {
    viewBox: '0 0 24 24',
    fillRule: 'nonzero',
    paths: [
      'M8.433 6H3l-.114.006a1 1 0 0 0-.743 1.508L4.833 12l-2.69 4.486l-.054.1A1 1 0 0 0 3 18h5.434l2.709 4.514l.074.108a1 1 0 0 0 1.64-.108L15.565 18H21l.114-.006a1 1 0 0 0 .743-1.508L19.166 12l2.691-4.486l.054-.1A1 1 0 0 0 21 6h-5.434l-2.709-4.514a1 1 0 0 0-1.714 0z'
    ]
  },
  islam: {
    viewBox: '0 0 14 14',
    paths: [
      'M7.325.003a7 7 0 1 0 3.529 12.92a.5.5 0 0 0-.264-.923a5 5 0 0 1 0-10a.5.5 0 0 0 .264-.923A7 7 0 0 0 7.325.003m4.87 4.941a.5.5 0 0 0-.894.002l-.4.806h-.774a.5.5 0 0 0-.359.848l.635.654l-.17.944a.5.5 0 0 0 .745.52l.776-.454l.822.46a.5.5 0 0 0 .733-.542l-.201-.936l.627-.646a.5.5 0 0 0-.358-.848h-.775z'
    ]
  },
  buddhism: {
    viewBox: '0 0 14 14',
    fillRule: 'nonzero',
    paths: [
      'M7 .023c-.246-.002-.484.325-.5.969c-2.897.254-5.243 2.602-5.5 5.5c-1.27 0-1.287.969 0 1c.229 2.916 2.585 5.22 5.5 5.469c0 1.404 1 1.356 1 0a5.915 5.915 0 0 0 5.469-5.47c1.395 0 1.356-1 0-1c-.25-2.917-2.552-5.272-5.469-5.5c0-.634-.254-.966-.5-.968m-.5 2.281v3.5L4.031 3.336a4.7 4.7 0 0 1 2.47-1.032m1 0A4.75 4.75 0 0 1 9.97 3.336L7.5 5.804zm3.188 1.72a4.73 4.73 0 0 1 1.031 2.468h-3.5zm-7.344.03l2.437 2.438H2.313a4.8 4.8 0 0 1 1.031-2.438M7 6.242a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5m-4.687 1.25h3.531l-2.5 2.5a4.75 4.75 0 0 1-1.031-2.5m5.843 0h3.563a4.74 4.74 0 0 1-1.063 2.5zM6.5 8.21v3.5a4.73 4.73 0 0 1-2.469-1.032zm1 0l2.469 2.5a4.75 4.75 0 0 1-2.469 1z'
    ]
  },
  // Mesmo ícone do polo "Irreligioso" do eixo religião.
  none: FILLED_POLE_ICONS.religiao.left!
};

// Selo da pergunta de religião (pessoa ajoelhada em oração).
export const RELIGION_QUESTION_ICON: FilledIcon = {
  viewBox: '0 0 640 640',
  fillRule: 'nonzero',
  paths: [
    'M448 128c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64M328.7 328l22.9 31.5c6.5 8.9 16.3 14.7 27.2 16.1s21.9-1.7 30.4-8.7l88-72c17.1-14 19.6-39.2 5.6-56.3s-39.2-19.6-56.3-5.6l-55.2 45.2l-26.2-36c-15.6-21.5-40.6-34.2-67.2-34.2c-30.9 0-59.2 17.1-73.6 44.4l-48.5 92.5c-20.2 38.5-9.4 85.9 25.6 111.8l53.2 39.3H168c-22.1 0-40 17.9-40 40s17.9 40 40 40h208c17.3 0 32.6-11.1 38-27.5s-.3-34.4-14.2-44.7L283.7 418z'
  ]
};

// Ícone do polo "Religioso": o da religião escolhida, ou a cruz padrão.
export function religiousPoleIcon(religion: Religion | null | undefined): FilledIcon | null {
  return religion ? RELIGION_ICONS[religion] : null;
}
