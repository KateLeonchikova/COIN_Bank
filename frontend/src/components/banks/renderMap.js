import ymaps from 'ymaps';
import { getBanks } from '../../utils/api/getBanks';

export async function renderMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found!');
    return;
  }

  const banks = await getBanks();

  const apiKey = 'f9b3e69f-b69d-4caf-8c29-e19fee45ddf1';

  ymaps
    .load(`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`)
    .then((maps) => {
      const myMap = new maps.Map('map', {
        center: [55.76082981798413, 37.63191688516094],
        zoom: 11,
      });

      myMap.controls.remove('geolocationControl');
      myMap.controls.remove('fullscreenControl');
      myMap.controls.remove('zoomControl');

      const geoObjects = new maps.GeoObjectCollection(null, {
        preset: 'islands#blueIcon',
      });

      banks.payload.forEach((bank) => {
        const coordinates = [bank.lat, bank.lon];

        let placemark = new maps.Placemark(coordinates, {
          balloonContent: 'Coin',
        });

        geoObjects.add(placemark);
      });
      myMap.geoObjects.add(geoObjects);
    })
    .catch((error) => console.error('Failed to load Yandex Maps', error));
}
