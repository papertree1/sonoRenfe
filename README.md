# sonoRenfe
Projecte de sonificació de la situació de Rodalies Renfe a partir de les APIS d'informació creat per [Adrià Illa Sanchis](https://github.com/papertree1) i [Omar Olmedo Ferrer](https://github.com/stratocastero).

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