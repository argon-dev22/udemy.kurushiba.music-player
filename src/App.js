import { useEffect, useRef, useState } from "react";
import { SongList } from "./Components/SongList";
import spotify from "./lib/spotify";
import { Player } from "./Components/Player";
import { SearchInput } from "./Components/SearchInput";
import { Pagination } from "./Components/Pagination";

export default function App() {
  const LIMIT = 20;

  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [keyword, setKeyword] = useState("");
  const [searchedSongs, setSearchedSongs] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const audio = useRef(null);

  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async () => {
    setIsLoading(true);

    const res = await spotify.getPopularSongs();
    // console.log(res);
    // 曲の情報を取得してくるための記述
    const popularSongs = res.tracks.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);

    setIsLoading(false);
  };

  const playSelectedSong = (song) => {
    setSelectedSong(song);

    if (!song.preview_url) {
      pauseSong();
      return;
    }

    audio.current.src = song.preview_url;
    playSong();
  };

  const toggleSong = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const playSong = () => {
    audio.current.play();
    setIsPlaying(true);
  };

  const pauseSong = () => {
    audio.current.pause();
    setIsPlaying(false);
  };

  const showSearchedSongs = async (page) => {
    if (keyword === "") {
      setSearchedSongs(null);
      return;
    }

    setIsLoading(true);

    const offset = (parseInt(page) - 1) * LIMIT;
    setOffset(offset);

    const res = await spotify.searchSongs(keyword, LIMIT, offset);
    setSearchedSongs(res.items);
    setTotal(res.total);

    setCurrentPage(page);

    setIsLoading(false);
  };

  const handleNext = async () => {
    const nextPage = currentPage + 1;
    await showSearchedSongs(nextPage);
  };

  const handlePrev = async () => {
    const prevPage = currentPage - 1;
    await showSearchedSongs(prevPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput
          setKeyword={setKeyword}
          showSearchedSongs={showSearchedSongs}
        />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {searchedSongs
              ? `Searched Result of "${keyword}" for ${offset + 1}-${
                  offset + LIMIT
                }/${total} songs`
              : "Popular Songs"}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={searchedSongs || popularSongs}
            playSelectedSong={playSelectedSong}
          />
          {searchedSongs && (
            <Pagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              currentPage={currentPage}
              LIMIT={LIMIT}
              searchedSongs={searchedSongs}
              total={total}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          toggleSong={toggleSong}
          isPlaying={isPlaying}
        />
      )}

      <audio ref={audio} />
    </div>
  );
}
