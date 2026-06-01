# sonoRenfe
Projecte de sonificació de la situació de Rodalies Renfe a partir de les APIS d'informació creat per [Adrià Illa Sanchis](https://github.com/papertree1) i [Omar Olmedo Ferrer](https://github.com/stratocastero).

## Funcionament del projecte
### Servidor
El servidor de JavaScript (NodeJS) demana a la API de Renfe les dades de tots els trens d'una línia i redueix tots els horaris

### Patch de Max
El patch de Max, que sonifica les dades que rep per OSC, és la implementació d'un

Paràmetres mapejats:
- **Trens totals**: controla el PWM de l'ona quadrada del baix i la Q del LPF del baix
- **Trens amb retard**: en funció de la relació amb els trens totals, controla el mode de l'obra entre jònic, mixolidi, dòric, frigi i caos i la velocitat d'un LFO que modula el PWM del baix
- **Retard total**: canvia el temps entre les notes dels acords i la quantitat de delay que tenen
- **Retard màxim**: controla la freqüència de tall del LPF del baix, la Q del filtre ressonant del les notes dels acords i la desafinació de les notes dels acords (a partir dels 10 min de retard)
- **Retard mitjà**: controla el tempo de l'obra entre 10 i 60 bpm i la quantitat de distorsió del baix
- **Alertes**: disparen diferents sons de trens enregistrats (xiulets i sintonies, motors, soroll de gent a les parades, etc) processats per canviar la seva velocitat de reproducció 

## Instruccions per arrencar el projecte
1. Clonar o descarregar el repositori

2. Instal·lar la font `Minecart LCD` de la carpeta `/Projecte/Patch`

3. Obrir el patch de Max MSP de la carpeta `/Projecte/Patch` i activar l'àudio

4. Entrar a la carpeta `/Projecte/Server`

5. Obrir una terminal i executar l'ordre `npm i` (s'ha de tenir instal·lat [NodeJS](https://nodejs.org/))

6. Executar el servidor en un dels dos modes:
    - Per obrir el **projecte complet** amb les dades de Renfe en temps real: executar a la terminal l'ordre `node dades.js` 
    - Per executar la **demo de 4 min** que funciona sense connexió a Internet: executar a la terminal l'ordre `node dades_demo.js`

7. Tornar al patch de Max MSP per gaudir d'una experiència musical absolutament esfereïdora

## Documentació
- Els **objectius**, la planificació i les conclusions del projecte es poden trobar [aquí](planificacio.md)

- La **memòria** del projecte es pot trobar [aquí](memoria.md)

- Els **recursos** que hem anat trobant al llarg del projecte es poden trobar [aquí](recursos.md)

- Les **idees** que hem anat tenint al llarg del projecte es poden trobar [aquí](idees.md)