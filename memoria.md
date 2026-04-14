# Memòria
## 10 de febrer
- Refinar la idea i planificar el quadrimestre.

## 17 de febrer
- Recerca de diferents mètodes de fer HTTP Requests dins de Max
    - Objecte [`maxurl`](https://docs.cycling74.com/reference/maxurl/)
    - Llibreria [Node for Max](https://docs.cycling74.com/apiref/nodeformax/)
- Exploració i inici d'implementació de l'objecte `maxurl`
    - Proves amb diferents endpoints de l'API per veure quina informació ens proporcionen
    - Anàlisi amb els fitxers .json inclosos a la carpeta [/Proves](/Proves), que corresponen a les respostes de diferents requests

## 24 de febrer
- Trobada app Transporta'm, que consulta els trens a la seva propia API (veure links als [Recursos](https://github.com/papertree1/sonoRenfe/blob/main/recursos.md))

## 3 de març
- Hem descobert que als timetables hi ha els ID dels trens de cada línia
- Hem netejat els resultats dels ID dels trens fent peticions per 1000 IDs i eliminant els que no donen resposta ([app node](./Proves/peticions/routes/index.js))
- Estem intentant esbrinar com funcionen els temps i dates (renfe caos)

## 10 de març
- Reestructuració de l'script i adaptació per a treure les dades de l'endpoint `timetables`
- Fent una crida a aquest endpoint podrem veure tots els IDs dels trens
- Hem trobat els IDs de les estacions d'inici i final de cada linia.

## 17 de març
- Actualitzat [recursos](./recursos.md) amb la informació que volem de cada endpoint.
- Començat [l'script](./scripts/obtenirLinies.js) final per a ajuntar les dades i començar a tractar els números per a la sonificació.

## 24 de març
- Ens hem adonat que l'endpoint `/trains/id` només retorna els horaris de les estacions futures, i elimina les estacions per les quals el tren ja ha passat.
- Per a obtenir l'estat del servei, doncs, haurem de comparar les dades d'aquest endpoint amb aquelles de `/timetables`.
- Hem trobat un altre [recurs](./recursos.md) amb informació a temps real de la localització GPS de tots els trens de Renfe.

## 31 de març
- Vacances Setmana Santa

## 7 d'abril
- Vacances Setmana Santa

## 14 d'abril
- Hem parlat amb el creador de la app Transporta'm
- Hem trobat un servei de informació (GTFS-RT) que dona informació dels trens actius, però sembla que no hi ha tota la informació disponible (potser passa com amb els horaris que desapareixen quan el tren arriba a l'estació)
- Hem planificat els passos que hem de seguir per obtenir els retards:
    - Obtenir trens actius
    - Obtenir situació dels trens amb `/trains`
    - Obtenir horaris teòrics (no sabem com)
    - Comparar horaris teòrics i reals per obtenir el retard

## 21 d'abril
- Miau

## 28 d'abril
- Pre-presentació

## 31 d'abril
- Miau

## 07 de maig
- Miau

## 14 de maig
- Miau

## 21 de maig
- Miau

## 28 de maig
- Miau

## 05 de juny
- Miau

## 12 de juny
- Miau
