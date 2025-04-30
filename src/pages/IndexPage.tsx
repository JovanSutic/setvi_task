import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Input,
  SelectPicker,
  IconButton,
  InputGroup,
  Loader,
  Message,
} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import SearchIcon from "@rsuite/icons/Search";
import SortableList from "../components/SortableList";
import axios from "axios";
import { useAppStore } from "../utils/store";



const IndexPage = () => {
  const navigate = useNavigate();
  const { reports, loading, error, setReports, setLoading, setError } =
    useAppStore();
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

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports`);
        setReports(res.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load reports.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!reports.length) {
      fetchReports();
    }
  }, [reports, setError, setLoading, setReports]);

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

      {loading && <Loader center size="md" content="Loading reports..." />}
      {error && <Message type="error" header={error} />}
      {!loading && !error && <SortableList reports={sortedFilteredReports} />}
    </div>
  );
};

export default IndexPage;
