# APIs i fonts de dades

## APIs oficials

### [API Renfe](https://data.renfe.com/api/1/util/snippet/api_info.html?resource_id=a2368cff-1562-4dde-8466-9635ea3a572a) 

La informació dels trens i les línies està repartida per tots els endpoints:
- **/timetables** IDs dels trens actius en un moment donat
- **/timetables** Línia de cada tren
- **/timetables** Temps total teòric de la línia
- **/trains/id** retorna la informació d'un tren vàlid. En cas de ser un tren actiu, retorna les estacions per on ha passat i les hores
- **/lines** estació inicial i final de la línia
- **/lines** totes les estacions de la línia
- **/stations/id** les connexions de cada parada

[Swagger de l'API](https://serveisgrs.rodalies.gencat.cat/api/swagger-ui/index.html) (llista d'endpoints)

### Altres serveis

[API Ubicación de los vehículos](https://data.renfe.com/dataset/ubicacion-vehiculos) (RENFE Data): hi ha un endpoint amb un `.json` que s'actualitza periòdicament i un stream de dades GTFS

[Estat del servei de Rodalies](https://datos.gob.es/ca/catalogo/a09002970-estado-del-servicio-de-cercanias-de-catalunya): XML que s'actualitzen amb RSS

[APIs FGC](https://dadesobertes.fgc.cat/explore/?sort=modified): mirar les que posa "Realtime"

### App Transporta'm

[App Transporta'm](https://play.google.com/store/apps/details?id=cat.transportam.app): app per consultar el servei del transport públic

[Repo de la app](https://github.com/transportam/app/), de [David Cortés Toledano](https://github.com/dacoto) (sabem que té les IDs dels trens, però fa les crides a la seva propia [API](https://api.transportam.cat/))

## Vídeos

[Sonificació d'una API amb MSP/Max](https://www.youtube.com/watch?v=gLb1s87YWHw)
