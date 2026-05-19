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
- *Vacances Setmana Santa*

## 7 d'abril
- *Vacances Setmana Santa*

## 14 d'abril
- Hem parlat amb el creador de la app Transporta'm
- Hem trobat un servei de informació (GTFS-RT) que dona informació dels trens actius, però sembla que no hi ha tota la informació disponible (potser passa com amb els horaris que desapareixen quan el tren arriba a l'estació)
- Hem planificat els passos que hem de seguir per obtenir els retards:
    - Obtenir trens actius
    - Obtenir situació dels trens amb `/trains`
    - Obtenir horaris teòrics (no sabem com)
    - Comparar horaris teòrics i reals per obtenir el retard

## 21 d'abril
- Hem aconseguit els **horaris teòrics** de tota la xarxa Renfe Espanya d'un fitxer CSV, i n'hem extret només els de Rodalies
    - Es poden trobar amb format JSON [aquí](./scripts/data/horaris_teorics_format.json)
- Començant amb una sola línia (R2), hem aconseguit obtenir els trens actius i les seves dades de manera asíncrona. D'aquesta manera, esperem a que l'API retorni totes les peticions abans de tractar-les
- Hem fet la connexió amb Max per OSC. De moment, enviem només l'hora actual i l'hora de la següent parada del tren i hem fet una demo a Max que fa sonar notes en funció del temps que queda per l'arribada. Hem modificat el programa de JavaScript perquè faci les peticions de manera recurrent de manera que tota l'estona enviem dades noves al patch de Max

## 28 d'abril
- *Pre-presentació*

## 5 de maig
- Hem comprovat que els horaris teòrics no serveixen de gaire perquè la pròpia Renfe no programa els trens per aquelles hores (l'horari al que assignen els trens a la primera parada de la línia ja no es correspon)
- Hem decidit guardar aquests horaris "assignats" i calcular nosaltres el retard a mesura que es produeixi
- Hem de netejar l'arxiu R2 de dades superflues (accessibilitat, andana, hora de sortida) per poder guardar aquestes dades seguint el següent procediment:
    - Guardar totes les dades el primer cop que fem una petició
    - Anar actualitzant en un altre camp les dades per poder-ne detectar les discrepàncies
    - Calcular el retard quan n'hi hagi
    - Enviar aquestes dades al OSC

## 12 de maig
- *Adrià a Hèlsinki (Erasmus+, electroacustica)*
- Procediment d'**obtenció de dades** actualitzat:
    - Primera petició:
        - Guardar totes les dades dels trens de la línia (anada i tornada) amb els seus ID
        - Guardar la propera parada (ID + nom) i l'hora d'arribada prevista
            ``` javascript
            linia = {
                anada: [
                    {
                        id: 54321,
                        hora: 123456789, // guardar en millis per simplificar càlculs(?)
                        properaEstacio: "Sant Celoni",
                        properaEstacioId: 12345,
                        retard: 0
                    }
                ],
                tornada: [
                    ...
                ]
            }
            ```
    - Següents peticions:
        - Si l'hora ha canviat, actualitzar-la
            - Calcular el retard afegit i guardar-lo en una nova propietat
            - **MISSATGE OSC**: el tren va amb retard, enviar-lo
        - Si la parada del tren ha desaparegut, ja ha sortit
            - Calcular amb el temps actual si ha arribat tard per afegir-ho al retard (opcional?)
            - **MISSATGE OSC**: tren ha arribat/sortit, per triggerejar so de tren/portes/gent/megafonia
            - Si era la última parada, eliminar el tren (?)
        - Si no ha canviat, no fer res

- Per poder-ho fer **interactiu**, selecció de línies, etc necessitem:
    - Array/JSON amb cada línia i les seves parades d'origen i destí
    - Fer la primera petició amb parada d'origen i destí del dret i del revés
        ``` javascript
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=79104&destinationStationId=72400`) // R2
        ```
    - Crear un array genèric per la línia seleccionada amb dos sub-arrays per l'anada i la tornada
        ``` javascript
        linia = { 
            anada: [],
            tornada: []
        };
        ```

## 19 de maig
- Actualització de l'obtenció de dades, seguint la guia de la setmana passada
    - Generalització del fetch per a poder incorporar altres línies
    - Incorporació d'anades i tornades
    - Preparació per al càlcul dels retards
- Per la setmana que ve, caldrà:
    - Fer comprovació de canvis als trens a partir del segon fetch
    - Càlcular els retards
    - Començar a crear la logística de la implementació dins de Max

## 26 de maig
- Miau

## 28 de maig
- Miau

## 2 de juny
- Miau

## 9 de juny
- Miau
