import { create } from "zustand";
import { Artist } from "../../../generated/model";

export type ArtistListInfo = {
  artistList: Artist[];
  setArtistList: (arg: Artist[]) => void;
};

const useArtistListInfoStore = create<ArtistListInfo>((set) => ({
  artistList: [],
  setArtistList: (val: Artist[]) =>
    set((state) => ({ ...state, artistList: val })),
}));

export default useArtistListInfoStore;
