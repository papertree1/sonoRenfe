# Objectius i planificació

## Objectius
- Explorar les possibles relacions entre dades i música
- Comparar diferents mètodes d'extracció de dades i de sonificació
- Comparar diferents interfícies d'usuari (Patch de Max, Web, ...)
- Crear una interfície d'usuari que permeti "escoltar les dades"

## Planificació
- Establiment d'objectius i planificació (1 setmana)
- Recerca i definició de les eines que s'utilitzaran (2 setmanes)
- Exploració de les APIs (2 setmanes)
- Implementació bàsica de les APIs (1 setmanes)
- Exploració i experimentació de propostes sonores (2 setmanes)
- Sonificació de les dades (4 setmanes)
- Interfície (2 setmanes)

## Acompliment dels objecius i la planificació

### Objectius
- S'han explorat maneres de fer sonar les dades en funció de les dades rebudes
- S'han explorat diferents mètodes d'extracció de dades (d'un sol tren, d'una parada, etc) fins a quedar-nos amb l'estat dels retards d'una línia quantificats en una sèrie de paràmetres (trens totals, trens amb retard, retard màxim, retard mitjà i retard total)
- Com a interfície d'usuari només s'ha provat el patch de Max, no hem tingut temps d'explorar altres vies
- Hem desenvolupat una interfície en el patch de Max que permet sel·leccionar la línia a escoltar alhora que es monitoritzen les dades

### Planificació
- S'ha acomplert tota la primera part sobre establiment d'objectius, exploració de recursos i primeres proves
- S'ha allargat el temps de construcció del servidor, degut a la complexitat de les estructures de dades de les APIs consultades
- Ha faltat més temps per explorar les possibilitats sonores i d'interfície

## Desenvolupament futur
- Refinar el servidor per calcular els retards amb més precisió (p.e. des de primera hora del matí quan s'assignen els trens, totes les línies alhora, etc) 
- Allotjar el servidor online i trobar una manera de fer públic online el patch de Max perquè es pugui escoltar en directe des de un web
- Donar més alternatives a l'hora d'escoltar les dades: diferents escales, diferents instruments, activació/desactivació de capes, filtres per escoltar-ho de fons, etc
- 