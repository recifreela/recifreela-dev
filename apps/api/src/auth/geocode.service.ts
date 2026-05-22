import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodeService {
  private cache = new Map<string, { lat: string; lon: string }>();

  async geocodeEndereco(endereco: string) {
    if (this.cache.has(endereco)) {
      return this.cache.get(endereco)!;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        endereco,
      )}&format=json&limit=1`;

      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Recifreela/1.0',
        },
      });

      if (!res.data?.length) return null;

      const result = {
        lat: res.data[0].lat,
        lon: res.data[0].lon,
      };

      this.cache.set(endereco, result);

      return result;
    } catch {
      return null;
    }
  }
}
