export function Pagination(props) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={props.handlePrev}
        disabled={props.currentPage <= 1}
        className="bg-gray-700 hover:bg-gray-600 mr-3 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {props.currentPage}
      <button
        onClick={props.handleNext}
        disabled={
          props.LIMIT > props.searchedSongs.length ||
          props.LIMIT === props.total
        }
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        Next
      </button>
    </div>
  );
}
