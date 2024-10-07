import createSupabaseIcon from '../createSupabaseIcon';

/**
 * @component @name ReplaceCode
 * @description Supabase SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgICBzdHJva2U9IiMwMDAiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOyBib3JkZXItcmFkaXVzOiAycHgiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTS0yMDQwMyAtMTExNDJIMTIxNjVWLTExMTQ0SC0yMDQwM1YtMTExNDJaTTEyMTY2IC0xMTE0MVY3MTEzSDEyMTY4Vi0xMTE0MUgxMjE2NlpNMTIxNjUgNzExNEgtMjA0MDNWNzExNkgxMjE2NVY3MTE0Wk0tMjA0MDQgNzExM1YtMTExNDFILTIwNDA2VjcxMTNILTIwNDA0Wk0tMjA0MDMgNzExNEMtMjA0MDMuNiA3MTE0IC0yMDQwNCA3MTEzLjU1IC0yMDQwNCA3MTEzSC0yMDQwNkMtMjA0MDYgNzExNC42NiAtMjA0MDQuNyA3MTE2IC0yMDQwMyA3MTE2VjcxMTRaTTEyMTY2IDcxMTNDMTIxNjYgNzExMy41NSAxMjE2NS42IDcxMTQgMTIxNjUgNzExNFY3MTE2QzEyMTY2LjcgNzExNiAxMjE2OCA3MTE0LjY2IDEyMTY4IDcxMTNIMTIxNjZaTTEyMTY1IC0xMTE0MkMxMjE2NS42IC0xMTE0MiAxMjE2NiAtMTExNDEuNiAxMjE2NiAtMTExNDFIMTIxNjhDMTIxNjggLTExMTQyLjcgMTIxNjYuNyAtMTExNDQgMTIxNjUgLTExMTQ0Vi0xMTE0MlpNLTIwNDAzIC0xMTE0NEMtMjA0MDQuNyAtMTExNDQgLTIwNDA2IC0xMTE0Mi43IC0yMDQwNiAtMTExNDFILTIwNDA0Qy0yMDQwNCAtMTExNDEuNiAtMjA0MDMuNiAtMTExNDIgLTIwNDAzIC0xMTE0MlYtMTExNDRaIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4xIiAvPgogICAgPHJlY3QgeD0iNi40NDUzMSIgeT0iMTQuMTEzMyIgd2lkdGg9IjE1Ljg0NTUiIGhlaWdodD0iNy45MTgxOCIgcng9IjMuOTU5MDkiIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0xMC41ODk2IDEwLjAxOTVMMTguMjE0OCAxMC4wMTk1QzE5LjA0MzMgMTAuMDE5NSAxOS43MTQ4IDkuMzQ3OTYgMTkuNzE0OCA4LjUxOTUzTDE5LjcxNDggMy41OTIyNUMxOS43MTQ4IDIuNzYzODMgMTkuMDQzMyAyLjA5MjI2IDE4LjIxNDggMi4wOTIyNkw1Ljk5NjA5IDIuMDkyMjYiCiAgICAgICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgogICAgPHBhdGggZD0iTTUuOTg5MDIgMTAuNDY1NlY1Ljc4OTA2SDEuMzEyNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiAvPgogICAgPHBhdGggZD0iTTMuMjcxMTEgMTMuNjEzM1YxMy42MTMzQzEuNjE1MTUgMTIuMzkxNCAxLjQ3OTQ4IDkuOTY0NDYgMi45ODg5NCA4LjU2NTY0TDUuOTk2MDkgNS43Nzg5MSIKICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+Cjwvc3ZnPg==)
 *
 * @param {Object} props - Supabase icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ReplaceCode = createSupabaseIcon('ReplaceCode', [
  [
    'path',
    {
      d: 'M-20403 -11142H12165V-11144H-20403V-11142ZM12166 -11141V7113H12168V-11141H12166ZM12165 7114H-20403V7116H12165V7114ZM-20404 7113V-11141H-20406V7113H-20404ZM-20403 7114C-20403.6 7114 -20404 7113.55 -20404 7113H-20406C-20406 7114.66 -20404.7 7116 -20403 7116V7114ZM12166 7113C12166 7113.55 12165.6 7114 12165 7114V7116C12166.7 7116 12168 7114.66 12168 7113H12166ZM12165 -11142C12165.6 -11142 12166 -11141.6 12166 -11141H12168C12168 -11142.7 12166.7 -11144 12165 -11144V-11142ZM-20403 -11144C-20404.7 -11144 -20406 -11142.7 -20406 -11141H-20404C-20404 -11141.6 -20403.6 -11142 -20403 -11142V-11144Z',
      'fill-opacity': '0.1',
      key: 'g9kgmq',
    },
  ],
  [
    'rect',
    {
      x: '6.44531',
      y: '14.1133',
      width: '15.8455',
      height: '7.91818',
      rx: '3.95909',
      key: '1evqnx',
    },
  ],
  [
    'path',
    {
      d: 'M10.5896 10.0195L18.2148 10.0195C19.0433 10.0195 19.7148 9.34796 19.7148 8.51953L19.7148 3.59225C19.7148 2.76383 19.0433 2.09226 18.2148 2.09226L5.99609 2.09226',
      'stroke-linecap': 'round',
      key: '18tp5x',
    },
  ],
  [
    'path',
    {
      d: 'M5.98902 10.4656V5.78906H1.3125',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      key: 'sfubon',
    },
  ],
  [
    'path',
    {
      d: 'M3.27111 13.6133V13.6133C1.61515 12.3914 1.47948 9.96446 2.98894 8.56564L5.99609 5.77891',
      'stroke-linecap': 'round',
      key: '1w6ie7',
    },
  ],
]);

export default ReplaceCode;
