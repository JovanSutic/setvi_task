import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Input, SelectPicker, IconButton, InputGroup } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import SearchIcon from "@rsuite/icons/Search";
import SortableList from "../components/SortableList";

export type IReport = {
  id: number;
  title: string;
};

const IndexPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState<IReport[]>([]);

  const sortOrder = searchParams.get("sort") ?? "asc";
  const searchQuery = searchParams.get("q") ?? "";

  const handleSortChange = (value: string | null) => {
    if (value) {
      searchParams.set("sort", value);
      setSearchParams(searchParams);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reports`)
      .then((res) => res.json())
      .then((reports) => setReports(reports.data))
      .catch(console.error);
  }, []);

  const handleSearchChange = (value: string) => {
    searchParams.set("q", value);
    setSearchParams(searchParams);
  };

  const sortedFilteredReports = useMemo(() => {
    let filteredReports = [...reports];

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
  }, [searchQuery, sortOrder, reports]);

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

