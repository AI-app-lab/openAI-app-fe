export interface TTSRequestDto {
  common: {};
  business: {
    aue: string;
    tte: string;
    ent: string;
    vcn: string;
    pitch: number;
    speed: number;
    sfl: number;
  };
  data: {
    text: string;
    status: number;
  };
}
