import { parseFile } from "music-metadata";

export class MusicData {
  readonly path: string;
  title: string;
  trackNumber: number;
  artist: string;
  album: string;
  year: number;
  codec: string;
  duration: number;
  lossless: boolean;
  bitrate: number;

  constructor(path: string) {
    this.path = path;
  }

  async scanData() {
    const data = await parseFile(this.path);
    this.title = data.common.title;
    this.trackNumber = data.common.track.no;
    this.artist = data.common.artist;
    this.album = data.common.album;
    this.year = data.common.year;
    this.duration = data.format.duration;
    this.codec = data.format.codec;
    this.lossless = data.format.lossless;
    this.bitrate = data.format.bitrate;

    return this;
  }

  async getCover() {
    const data = await parseFile(this.path, { skipCovers: false });
    return data.common.picture;
  }

  toJSON() {
    return {
      path: this.path,
      title: this.title,
      trackNumber: this.trackNumber,
      artist: this.artist,
      album: this.album,
      year: this.year,
      duration: this.duration,
      codec: this.codec,
      lossless: this.lossless,
      bitrate: this.bitrate,
    };
  }
}
