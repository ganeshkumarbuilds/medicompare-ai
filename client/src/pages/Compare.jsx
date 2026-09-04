import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

function Compare() {
    const [hospitals, setHospitals] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [comparison, setComparison] = useState([]);

    const [loadingHospitals, setLoadingHospitals] = useState(true);
    const [loadingComparison, setLoadingComparison] = useState(false);

    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadHospitals();
    }, []);

    async function loadHospitals() {
        try {
            setLoadingHospitals(true);
            setError("");

            const response = await api.get("/hospitals", {
                params: {
                    size: 100,
                },
            });

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            setHospitals(data);
        } catch (err) {
            console.error("Failed to load hospitals:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load hospitals."
            );
        } finally {
            setLoadingHospitals(false);
        }
    }

    function toggleHospital(id) {
        setError("");

        setSelectedIds((current) => {
            if (current.includes(id)) {
                return current.filter(
                    (hospitalId) => hospitalId !== id
                );
            }

            if (current.length >= 4) {
                return current;
            }

            return [...current, id];
        });
    }

    async function compareHospitals() {
        if (selectedIds.length < 2) {
            setError(
                "Please select at least 2 hospitals to compare."
            );
            return;
        }

        try {
            setLoadingComparison(true);
            setError("");
            setComparison([]);

            /*
             * Build the query string explicitly:
             *
             * /compare/hospitals?hospitalIds=1&hospitalIds=2
             *
             * This works correctly with Spring's
             * @RequestParam List<Long> hospitalIds.
             */
            const query = selectedIds
                .map(
                    (id) =>
                        `hospitalIds=${encodeURIComponent(id)}`
                )
                .join("&");

            const response = await api.get(
                `/compare/hospitals?${query}`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            if (data.length === 0) {
                throw new Error(
                    "The comparison service returned no results."
                );
            }

            setComparison(data);

            setTimeout(() => {
                document
                    .getElementById("comparison-results")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
            }, 100);
        } catch (err) {
            console.error("Comparison failed:", err);

            const backendMessage =
                err.response?.data?.message ||
                err.response?.data?.error;

            setError(
                backendMessage ||
                    err.message ||
                    "Unable to compare hospitals. Please try again."
            );

            setComparison([]);
        } finally {
            setLoadingComparison(false);
        }
    }

    function clearComparison() {
        setSelectedIds([]);
        setComparison([]);
        setError("");
    }

    const filteredHospitals = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return hospitals;
        }

        return hospitals.filter((hospital) => {
            const name =
                hospital.name?.toLowerCase() || "";

            const city =
                hospital.city?.toLowerCase() || "";

            const type =
                hospital.hospitalType?.toLowerCase() || "";

            const address =
                hospital.address?.toLowerCase() || "";

            return (
                name.includes(query) ||
                city.includes(query) ||
                type.includes(query) ||
                address.includes(query)
            );
        });
    }, [hospitals, search]);

    return (
        <div className="min-h-screen bg-[#faf9f7] text-ink-900">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                {/* PAGE HEADER */}

                <section>
                    <p className="text-sm font-semibold text-brand-600">
                        Hospital comparison
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Compare hospitals side by side
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-500">
                        Select two to four hospitals to compare
                        their ratings, consultation fees, services,
                        prices and availability.
                    </p>
                </section>

                {/* ERROR */}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* SELECTION */}

                <section className="mt-8">
                    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Select hospitals
                            </h2>

                            <p className="mt-1 text-sm text-ink-500">
                                {selectedIds.length} of 4 selected
                                <span className="mx-2">•</span>
                                {hospitals.length} hospitals available
                            </p>
                        </div>

                        <div className="flex gap-3">
                            {selectedIds.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearComparison}
                                    className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
                                >
                                    Clear
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={compareHospitals}
                                disabled={
                                    selectedIds.length < 2 ||
                                    loadingComparison
                                }
                                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loadingComparison
                                    ? "Comparing..."
                                    : "Compare selected"}
                            </button>
                        </div>
                    </div>

                    {/* SEARCH */}

                    {!loadingHospitals &&
                        hospitals.length > 0 && (
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search hospitals by name, city, type or address..."
                                        className="w-full rounded-xl border border-ink-200 bg-white px-5 py-3.5 pr-12 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                                    />

                                    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg">
                                        🔍
                                    </span>
                                </div>

                                {search && (
                                    <p className="mt-2 text-xs text-ink-500">
                                        Showing{" "}
                                        {
                                            filteredHospitals.length
                                        }{" "}
                                        of {hospitals.length} hospitals
                                    </p>
                                )}
                            </div>
                        )}

                    {/* LOADING */}

                    {loadingHospitals ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({
                                length: 6,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-56 animate-pulse rounded-2xl bg-white"
                                />
                            ))}
                        </div>
                    ) : filteredHospitals.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center">
                            <h3 className="font-semibold">
                                No hospitals found
                            </h3>

                            <p className="mt-2 text-sm text-ink-500">
                                Try another search.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredHospitals.map(
                                (hospital) => (
                                    <HospitalSelectionCard
                                        key={hospital.id}
                                        hospital={hospital}
                                        selected={selectedIds.includes(
                                            hospital.id
                                        )}
                                        disabled={
                                            selectedIds.length >= 4 &&
                                            !selectedIds.includes(
                                                hospital.id
                                            )
                                        }
                                        onSelect={() =>
                                            toggleHospital(
                                                hospital.id
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>

                {/* COMPARISON RESULTS */}

                {comparison.length > 0 && (
                    <div id="comparison-results">
                        <ComparisonTable
                            hospitals={comparison}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

/* =========================================================
   HOSPITAL SELECTION CARD
========================================================= */

function HospitalSelectionCard({
    hospital,
    selected,
    disabled,
    onSelect,
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            className={`overflow-hidden rounded-2xl border bg-white text-left transition ${
                selected
                    ? "border-brand-500 ring-2 ring-brand-100"
                    : "border-ink-200 hover:border-ink-300 hover:shadow-sm"
            } ${
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : ""
            }`}
        >
            <div className="relative h-36 bg-ink-100">
                {hospital.imageUrl ? (
                    <img
                        src={hospital.imageUrl}
                        alt={hospital.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                        🏥
                    </div>
                )}

                <div
                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full ${
                        selected
                            ? "bg-brand-500 text-white"
                            : "bg-white text-ink-400"
                    }`}
                >
                    {selected ? "✓" : ""}
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-semibold">
                    {hospital.name}
                </h3>

                <p className="mt-1 text-sm text-ink-500">
                    {hospital.city ||
                        hospital.address ||
                        "Location unavailable"}
                </p>

                {hospital.rating != null && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                            ★{" "}
                            {Number(
                                hospital.rating
                            ).toFixed(1)}
                        </span>

                        {hospital.hospitalType && (
                            <span className="text-xs text-ink-400">
                                {hospital.hospitalType}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
}

/* =========================================================
   COMPARISON TABLE
========================================================= */

function ComparisonTable({ hospitals }) {
    const allServices = useMemo(() => {
        const map = new Map();

        hospitals.forEach((hospital) => {
            (hospital.services || []).forEach(
                (service) => {
                    const key =
                        service.name
                            ?.trim()
                            .toLowerCase();

                    if (!key) {
                        return;
                    }

                    if (!map.has(key)) {
                        map.set(
                            key,
                            service.name
                        );
                    }
                }
            );
        });

        return Array.from(
            map.entries()
        ).map(([key, name]) => ({
            key,
            name,
        }));
    }, [hospitals]);

    function getService(
        hospital,
        serviceKey
    ) {
        return (hospital.services || []).find(
            (service) =>
                service.name
                    ?.trim()
                    .toLowerCase() ===
                serviceKey
        );
    }

    return (
        <section className="mt-12">
            <div className="mb-6">
                <p className="text-sm font-semibold text-brand-600">
                    Results
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                    Hospital comparison
                </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white shadow-sm">
                <table className="min-w-[900px] w-full border-collapse">
                    <thead>
                        <tr className="border-b border-ink-200 bg-ink-50">
                            <th className="sticky left-0 z-10 min-w-[220px] bg-ink-50 px-5 py-5 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                                Category
                            </th>

                            {hospitals.map(
                                (hospital) => (
                                    <th
                                        key={
                                            hospital.hospitalId
                                        }
                                        className="min-w-[220px] px-5 py-5 text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                                                {hospital.imageUrl ? (
                                                    <img
                                                        src={
                                                            hospital.imageUrl
                                                        }
                                                        alt={
                                                            hospital.hospitalName
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        🏥
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-ink-900">
                                                    {
                                                        hospital.hospitalName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs font-normal text-ink-500">
                                                    {
                                                        hospital.city
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        <ComparisonRow
                            label="Rating"
                            hospitals={hospitals}
                            render={(hospital) =>
                                hospital.rating != null
                                    ? `★ ${Number(
                                          hospital.rating
                                      ).toFixed(1)}`
                                    : "—"
                            }
                        />

                        <ComparisonRow
                            label="Consultation fee"
                            hospitals={hospitals}
                            render={(hospital) =>
                                hospital.consultationFee !=
                                null
                                    ? `₹${Number(
                                          hospital.consultationFee
                                      ).toLocaleString(
                                          "en-IN"
                                      )}`
                                    : "—"
                            }
                        />

                        <tr className="border-t border-ink-200">
                            <td
                                colSpan={
                                    hospitals.length + 1
                                }
                                className="bg-ink-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-ink-500"
                            >
                                Services
                            </td>
                        </tr>

                        {allServices.map(
                            (service) => {
                                const prices =
                                    hospitals
                                        .map(
                                            (
                                                hospital
                                            ) => {
                                                const item =
                                                    getService(
                                                        hospital,
                                                        service.key
                                                    );

                                                return item?.price !=
                                                    null
                                                    ? Number(
                                                          item.price
                                                      )
                                                    : null;
                                            }
                                        )
                                        .filter(
                                            (
                                                price
                                            ) =>
                                                price !==
                                                null
                                        );

                                const lowestPrice =
                                    prices.length > 0
                                        ? Math.min(
                                              ...prices
                                          )
                                        : null;

                                return (
                                    <tr
                                        key={
                                            service.key
                                        }
                                        className="border-t border-ink-100"
                                    >
                                        <td className="sticky left-0 bg-white px-5 py-5 align-top">
                                            <p className="font-semibold">
                                                {
                                                    service.name
                                                }
                                            </p>
                                        </td>

                                        {hospitals.map(
                                            (
                                                hospital
                                            ) => {
                                                const item =
                                                    getService(
                                                        hospital,
                                                        service.key
                                                    );

                                                if (!item) {
                                                    return (
                                                        <td
                                                            key={
                                                                hospital.hospitalId
                                                            }
                                                            className="px-5 py-5 align-top text-sm text-ink-400"
                                                        >
                                                            Not
                                                            offered
                                                        </td>
                                                    );
                                                }

                                                const price =
                                                    item.price !=
                                                    null
                                                        ? Number(
                                                              item.price
                                                          )
                                                        : null;

                                                const isCheapest =
                                                    price !==
                                                        null &&
                                                    lowestPrice !==
                                                        null &&
                                                    price ===
                                                        lowestPrice;

                                                return (
                                                    <td
                                                        key={
                                                            hospital.hospitalId
                                                        }
                                                        className="px-5 py-5 align-top"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div>
                                                                <p
                                                                    className={`font-semibold ${
                                                                        isCheapest
                                                                            ? "text-green-700"
                                                                            : "text-ink-900"
                                                                    }`}
                                                                >
                                                                    {price !==
                                                                    null
                                                                        ? `₹${price.toLocaleString(
                                                                              "en-IN"
                                                                          )}`
                                                                        : "—"}
                                                                </p>

                                                                {item.durationMinutes !=
                                                                    null && (
                                                                    <p className="mt-1 text-xs text-ink-400">
                                                                        {
                                                                            item.durationMinutes
                                                                        }{" "}
                                                                        min
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                    item.available
                                                                        ? "bg-green-50 text-green-700"
                                                                        : "bg-red-50 text-red-700"
                                                                }`}
                                                            >
                                                                {item.available
                                                                    ? "Available"
                                                                    : "Unavailable"}
                                                            </span>
                                                        </div>

                                                        {isCheapest && (
                                                            <p className="mt-2 text-xs font-semibold text-green-700">
                                                                Best
                                                                price
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }
                                        )}
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

/* =========================================================
   COMPARISON ROW
========================================================= */

function ComparisonRow({
    label,
    hospitals,
    render,
}) {
    return (
        <tr className="border-t border-ink-100">
            <td className="sticky left-0 bg-white px-5 py-5 font-semibold">
                {label}
            </td>

            {hospitals.map(
                (hospital) => (
                    <td
                        key={
                            hospital.hospitalId
                        }
                        className="px-5 py-5 text-sm"
                    >
                        {render(hospital)}
                    </td>
                )
            )}
        </tr>
    );
}

export default Compare;