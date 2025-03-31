type props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};
const Search: React.FC<props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
      <img src="search.svg" alt="search" />
      <input
        type="text"
        placeholder="search through thousands of movies"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
    </div>
  );
};

export default Search;
