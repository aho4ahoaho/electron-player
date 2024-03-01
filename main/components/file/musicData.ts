import { IAudioMetadata, parseFile } from "music-metadata";
import path from "path";

type MetaData = {
  common: Partial<IAudioMetadata["common"]>;
  format: Partial<IAudioMetadata["format"]>;
};
export class MusicData {
  readonly path: string;
  title: string;
  trackNo: number = -1;
  artist: string = "";
  album: string = "";
  year: number = -1;
  codec: string;
  duration: number = -1;
  lossless: boolean = false;
  bitrate: number = -1;

  constructor(filePath: string) {
    this.path = filePath;
    this.title = path.basename(filePath).split(".").slice(0, -1).join(".");
    this.codec = path.extname(filePath);
  }

  async scanData() {
    const data: MetaData = await parseFile(this.path);

    const { title, track, artist, album, year } = data.common;
    const { duration, codec, lossless, bitrate } = data.format;
    title && (this.title = title);
    track?.no && (this.trackNo = track.no);
    artist && (this.artist = artist);
    album && (this.album = album);
    year && (this.year = year);
    duration && (this.duration = duration);
    codec && (this.codec = codec);
    lossless && (this.lossless = lossless);
    bitrate && (this.bitrate = bitrate);

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
      trackNo: this.trackNo,
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
