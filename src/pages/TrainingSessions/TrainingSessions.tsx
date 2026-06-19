import React, { memo, useEffect, useCallback } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import CardTrainingSession from "../../components/Cards/CardTrainingSession";
import TrainingSessionsPagination from "../../components/Courses/List/TrainingSessionsPagination";
import TrainingSessionsBanner from "../../components/Courses/List/TrainingSessionsBanner";
import TrainingSessionsFilters from "../../components/Courses/List/TrainingSessionsFilters";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { TTrainingSessionListItem } from "../../types/cardType";
import {
  actGetTrainingSessions,
  actSearchTrainingSessions,
  setSearchTerm,
  setInstituteInput,
  setCategoryInput,
  setMinPriceInput,
  setMaxPriceInput,
  setLocationInput,
  applyFilters,
  resetFilters,
  setPage,
  selectIsFiltered,
  selectFilteredTrainingSessions,
  selectTotalPages,
  selectPaginatedTrainingSessions,
  actGetFilteredTrainingSessions,
  actGetCategories,
} from "../../store/Courses/trainingSessionsSlice";
import { TFilters } from "../../store/Courses/act/actGetFilteredTrainingSessions";

const TrainingSessions = memo(() => {
  const dispatch = useAppDispatch();
  const {
    trainingSessions,
    loading,
    error,
    searchTerm,
    instituteInput,
    categoryInput,
    minPriceInput,
    maxPriceInput,
    locationInput,
    page,
    categories,
    categoriesLoading,
    categoriesError,
  } = useAppSelector((state) => state.trainingSessions);

  const isFiltered = useAppSelector(selectIsFiltered);
  const filteredSessions = useAppSelector(selectFilteredTrainingSessions);
  const totalPages = useAppSelector(selectTotalPages);
  const paginatedSessions = useAppSelector(selectPaginatedTrainingSessions);

  useEffect(() => {
    // Fetch categories on mount
    dispatch(actGetCategories());
  }, [dispatch]);

  useEffect(() => {
    let promise: { abort: () => void };
    if (searchTerm.trim() === "") {
      promise = dispatch(actGetTrainingSessions());
    } else {
      promise = dispatch(actSearchTrainingSessions(searchTerm));
    }

    return () => {
      if (promise && promise.abort) {
        promise.abort;
      }
    };
  }, [dispatch, searchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    },
    [dispatch]
  );

  const handleApplyFilters = useCallback(() => {
    const filters: TFilters = {};
    if (categoryInput && categoryInput !== "") filters.category = categoryInput;
    if (instituteInput && instituteInput.trim() !== "") filters.instituteName = instituteInput.trim();
    if (locationInput && locationInput.trim() !== "") {
      filters.location = locationInput.trim();
      filters.address = locationInput.trim();
    }
    
    const minP = parseFloat(minPriceInput);
    if (!isNaN(minP)) filters.minPrice = minP;
    
    const maxP = parseFloat(maxPriceInput);
    if (!isNaN(maxP)) filters.maxPrice = maxP;
    
    console.log("Final filter params:", filters);
    dispatch(actGetFilteredTrainingSessions(filters));
    dispatch(applyFilters());
  }, [dispatch, categoryInput, instituteInput, minPriceInput, maxPriceInput, locationInput]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(actGetTrainingSessions());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      dispatch(setPage(value));
    },
    [dispatch]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
        mt: "80px",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <TrainingSessionsBanner
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          <Grid container spacing={3} direction="row-reverse">
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <TrainingSessionsFilters
            instituteInput={instituteInput}
            categoryInput={categoryInput}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            locationInput={locationInput}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            setInstituteInput={(val) => dispatch(setInstituteInput(val))}
            setCategoryInput={(val) => {
              console.log("Selected category:", val);
              dispatch(setCategoryInput(val));
            }}
            setMinPriceInput={(val) => dispatch(setMinPriceInput(val))}
            setMaxPriceInput={(val) => dispatch(setMaxPriceInput(val))}
            setLocationInput={(val) => dispatch(setLocationInput(val))}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
            </Grid>

            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  fontWeight: 800,
                  color: "#0b1b34",
                  fontFamily: "Tajawal",
                  fontSize: "1.5rem",
                  mb: 2.5,
                }}
              >
                الدورات التدريبية المتاحة
              </Typography>

              {loading === "pending" || loading === "idle" ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 0, 0, 0.05)",
                    p: 4,
                    textAlign: "center",
                    borderRadius: "16px",
                  }}
                >
                  <Typography color="error" sx={{ fontFamily: "Tajawal" }}>
                    حدث خطأ أثناء جلب البيانات: {error}
                  </Typography>
                </Box>
              ) : filteredSessions.length === 0 ? (
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    p: 4,
                    textAlign: "center",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Tajawal",
                      fontWeight: 700,
                      color: "#0b1b34",
                    }}
                  >
                    {trainingSessions.length === 0
                      ? "لا توجد دورات متاحة حالياً"
                      : isFiltered && filteredSessions.length === 0
                      ? "لا توجد نتائج مطابقة"
                      : "لا توجد نتائج مطابقة"}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Grid
                    container
                    spacing={3}
                    direction="row-reverse"
                    justifyContent="flex-start"
                  >
                    {paginatedSessions.map((session: TTrainingSessionListItem) => (
                      <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={session.id}
                      >
                        <CardTrainingSession trainingSession={session} />
                      </Grid>
                    ))}
                  </Grid>
                  {totalPages > 1 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <TrainingSessionsPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
});

export default TrainingSessions;


