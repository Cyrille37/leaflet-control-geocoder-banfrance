# Geocodeur pour la Base Adresse Nationale (BAN)

Ce script est un geocodeur pour le controle [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder) qui implémente la recherche d’adresses sur le service [API Base Adresse Nationale (BAN Api)](https://guides.data.gouv.fr/reutiliser-des-donnees/utiliser-les-api-geographiques/utiliser-lapi-adresse) qui ne couvre que les territoires français.

Voir la [demo](demo.html).

L'usage de ce geocoder se fait selon la documentation de "Leaflet Control Geocoder".

Le script `leaflet-control-geocoder-banfrance.js` est écrit en simple Javascript (Vanilla JS).

Voir le [code source](https://github.com/Cyrille37/leaflet-control-geocoder-banfrance).

## BAN

Voir le guide [API Base Adresse Nationale (BAN Api)](https://guides.data.gouv.fr/reutiliser-des-donnees/utiliser-les-api-geographiques/utiliser-lapi-adresse).

## AddOk

l'API BAN est rendue accessible avec le logiciel serveur [addok](https://github.com/addok/addok).

Documentation de l'[API addok](https://addok.readthedocs.io/en/latest/api/).

## Photon

Il est aussi possible de se passer de ce plugin en utilisant le geocodeur <code>Photon</code> fourni par [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder).

Voir la [démo photon](demo_photon-with-ban.html).

## Licence

Ce projet est partagé selon la licence [MIT License](LICENSE).
