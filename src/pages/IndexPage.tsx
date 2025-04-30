import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Input, SelectPicker, IconButton, InputGroup } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import SearchIcon from "@rsuite/icons/Search";
import SortableList from "../components/SortableList";

export type IReport = {
  id: number;
  title: string;
};

const sampleReports: IReport[] = [
  { id: 1, title: "Monthly Sales Report" },
  { id: 2, title: "Yearly Summary" },
  { id: 3, title: "User Feedback Analysis" },
  { id: 4, title: "Revenue Overview" },
  { id: 5, title: "Something AP" },
  { id: 6, title: "Purchase Overview 2025" },
];

const IndexPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const sortOrder = searchParams.get("sort") ?? "asc";
  const searchQuery = searchParams.get("q") ?? "";

  const handleSortChange = (value: string | null) => {
    if (value) {
      searchParams.set("sort", value);
      setSearchParams(searchParams);
    }
  };

  const handleSearchChange = (value: string) => {
    searchParams.set("q", value);
    setSearchParams(searchParams);
  };

  const sortedFilteredReports = useMemo(() => {
    let filteredReports = [...sampleReports];

    if (searchQuery) {
      filteredReports = filteredReports.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filteredReports.sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

    return filteredReports;
  }, [searchQuery, sortOrder]);

  console.log('rerender')

  return (
    <div>
      <div className="report-header">
        <div className="report-header__button">
          <IconButton
            icon={<PlusIcon />}
            appearance="primary"
            block
            onClick={() => navigate("/create")}
          >
            New Report
          </IconButton>
        </div>

        <div className="report-header__filters">
          <InputGroup className="filter-item">
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>

          <SelectPicker
            data={[
              { label: "Title Asc", value: "asc" },
              { label: "Title Desc", value: "desc" },
            ]}
            value={sortOrder}
            onChange={handleSortChange}
            searchable={false}
            cleanable={false}
            className="filter-item"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <SortableList reports={sortedFilteredReports} />
    </div>
  );
};

export default IndexPage;
