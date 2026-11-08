"use client";

import { useEffect, useState, type DragEvent, type FormEvent } from "react";
import Image from "next/image";

type PlantResult = {
  score: number;
  species: {
    scientificName: string;
    commonNames: string[];
    family?: {
      scientificName: string;
    };
  };
};

type IdentificationResponse = {
  bestMatch: string;
  results: PlantResult[];
};

function PlantLogo({ size = 64 }: { size?: number }) {
  return (
    <Image
      src="/plantlab-logo.png"
      alt="PlantLab logo"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

function CameraIcon({ size = 25 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7.5H7L8.5 5.5H15.5L17 7.5H20C20.8 7.5 21.5 8.2 21.5 9V18C21.5 18.8 20.8 19.5 20 19.5H4C3.2 19.5 2.5 18.8 2.5 18V9C2.5 8.2 3.2 7.5 4 7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LeafIllustration() {
  return (
    <svg
      viewBox="0 0 340 280"
      className="h-full w-full"
      fill="none"
      role="img"
      aria-label="Illustration of a plant inside a scanning frame"
    >
      <path
        d="M170 230V92"
        stroke="#285D36"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M170 160C105 164 76 119 85 69C145 65 183 105 170 160Z"
        fill="#79C96C"
        stroke="#2E873B"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M170 132C169 66 216 25 278 39C277 100 231 143 170 132Z"
        fill="#83D574"
        stroke="#2E873B"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M170 188C119 191 102 157 110 122C151 120 178 147 170 188Z"
        fill="#9BD98D"
        stroke="#2E873B"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M170 160C180 126 202 101 229 85"
        stroke="#2E873B"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M170 230C150 230 133 223 119 211M170 230C190 230 207 223 221 211"
        stroke="#285D36"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M45 63V38C45 32 49 28 55 28H80M260 28H285C291 28 295 32 295 38V63M295 217V242C295 248 291 252 285 252H260M80 252H55C49 252 45 248 45 242V217"
        stroke="#3D7046"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<IdentificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleFile(file: File | null) {
    if (!file || isLoading) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Please choose a JPEG or PNG image.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setMessage("Your image must be smaller than 50 MB.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setResults(null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a plant photo first.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://localhost:8000/identify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Plant identification failed.");
      }

      setResults(data as IdentificationResponse);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function removeImage() {
    setSelectedFile(null);
    setResults(null);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#f8f8f3] text-[#1d3425] md:flex">
      {/* SIDEBAR */}
      <aside className="hidden w-[244px] shrink-0 flex-col border-r border-[#dfe5d9] bg-[#f2f5ed] px-5 py-6 md:flex">
        <a href="#identify" className="mb-10 flex items-center gap-3 px-2 py-3">
          <PlantLogo size={48} />
          <span className="font-serif text-[25px] font-bold tracking-tight text-[#173d28]">PlantLab</span>
        </a>

        <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-[#788a76]">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          <a
            href="#identify"
            className="flex items-center gap-3 rounded-2xl bg-[#19452d] px-4 py-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(25,69,45,0.12)] transition hover:bg-[#123923]"
          >
            <SearchIcon />
            Identify a plant
          </a>

          <div className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3.5 text-sm text-[#687968]">
            <span className="flex items-center gap-3">
              <span className="text-xl">♧</span>
              My plants
            </span>
            <span className="rounded-full bg-[#dce8d3] px-2.5 py-1 text-[9px] font-semibold text-[#587052]">
              SOON
            </span>
          </div>

          <div className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3.5 text-sm text-[#687968]">
            <span className="flex items-center gap-3">
              <span className="text-xl">⌖</span>
              Explore
            </span>
            <span className="rounded-full bg-[#dce8d3] px-2.5 py-1 text-[9px] font-semibold text-[#587052]">
              SOON
            </span>
          </div>
        </nav>

        <div className="mt-auto">
          <div className="mb-5 rounded-[22px] bg-[#e5edda] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#d2e2c8] text-2xl text-[#285d36]">
              🌱
            </div>
            <p className="text-sm font-bold text-[#21452d]">Stay curious.</p>
            <p className="mt-1 text-xs leading-5 text-[#5f705e]">
              There&apos;s always something new growing around you.
            </p>
            <div className="mt-3 flex justify-end">
              <PlantLogo size={38} />
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#dce4d6] pt-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9d9bd] text-sm font-bold text-[#234b35]">
              G
            </div>
            <div>
              <p className="text-xs font-semibold text-[#234b35]">Guest workspace</p>
              <p className="mt-1 text-[10px] text-[#718071]">No account required</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN APPLICATION */}
      <div className="min-w-0 flex-1">
        {/* TOP BAR */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#e2e7dd] bg-[#fbfcf8] px-5 sm:px-8 lg:px-10">
          <a href="#identify" className="flex items-center gap-2 md:hidden">
            <PlantLogo size={38} />
            <span className="font-serif text-xl font-bold text-[#173d28]">PlantLab</span>
          </a>

          <div className="hidden items-center gap-2 text-sm md:flex">
            <span className="text-[#8a9487]">Workspace</span>
            <span className="text-[#aab2a6]">/</span>
            <span className="font-semibold text-[#234b35]">Identify a plant</span>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#dce5d8] bg-[#edf2e9]">
            <Image
              src="/plantlab-logo.png"
              alt="PlantLab"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </header>

        {/* MOBILE NAV */}
        <nav className="flex gap-2 overflow-x-auto border-b border-[#e2e7dd] bg-[#fbfcf8] px-5 py-3 md:hidden">
          <a href="#identify" className="shrink-0 rounded-full bg-[#19452d] px-4 py-2 text-xs font-semibold text-white">
            Identify a plant
          </a>
          <span className="shrink-0 rounded-full px-3 py-2 text-xs text-[#7b8978]">
            My plants · Soon
          </span>
          <span className="shrink-0 rounded-full px-3 py-2 text-xs text-[#7b8978]">
            Explore · Soon
          </span>
        </nav>

        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          {/* PAGE INTRO */}
          <section className="relative mb-8 overflow-hidden">
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5b9a53]" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#64845d]">
                  YOUR PLANT DISCOVERY SPACE
                </p>
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#173d28] sm:text-4xl lg:text-[46px]">
                Let&apos;s get to know a plant.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657061] sm:text-base">
                Every leaf has a story. Upload a photo and let PlantLab help you
                discover the plant behind it.
              </p>
            </div>
          </section>

          {/* IDENTIFICATION AREA */}
          <section id="identify" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
            <div className="min-w-0">
              <form
                onSubmit={handleSubmit}
                className="rounded-[26px] border border-[#dfe6d9] bg-[#fffefa] p-5 shadow-[0_8px_28px_rgba(35,75,53,0.055)] sm:p-7 lg:p-8"
              >
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#e8ece4] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#eaf1e4]">
                      <Image src="/plantlab-logo.png" alt="PlantLab" width={48} height={48} className="h-full w-full scale-125 object-cover" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1c3d29]">
                        Plant identification
                      </h2>
                      <p className="mt-1 text-xs text-[#758071]">
                        Start with a clear photo of your plant.
                      </p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-full bg-[#eaf1df] px-3 py-2 text-[11px] font-semibold text-[#315f35] sm:flex">
                    <span>✓</span> Free to use
                  </span>
                </div>

                {/* UPLOAD DROP ZONE */}
                <label
                  htmlFor="plant-image"
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative flex min-h-[285px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border-2 border-dashed px-5 py-8 text-center transition sm:min-h-[315px] ${isLoading
                    ? "pointer-events-none cursor-not-allowed opacity-70"
                    : isDragging
                      ? "border-[#43844a] bg-[#edf5e8]"
                      : previewUrl
                        ? "border-[#d4e1ce] bg-[#f8faf5]"
                        : "border-[#cbd8c5] bg-[#fbfcf8] hover:border-[#79a16f] hover:bg-[#f4f8f0]"
                    }`}
                >
                  {previewUrl ? (
                    <div className="flex w-full flex-col items-center">
                      <div className="relative flex h-52 w-full items-center justify-center overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Selected plant"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <p className="max-w-full break-all text-sm font-semibold text-[#234b35]">
                        {selectedFile?.name}
                      </p>
                      <p className="mt-1 text-xs text-[#758071]">
                        Click to choose a different photo
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-5 flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#e8efdf] text-[#1d5130]">
                        <CameraIcon size={39} />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#173d28] sm:text-2xl">
                        Drop your plant photo here
                      </h3>
                      <p className="mt-2 text-sm text-[#687568]">
                        Or browse your files to choose an image
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#19452d] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123923]">
                        <CameraIcon size={18} />
                        Browse photos
                      </span>
                      <p className="mt-4 text-[11px] text-[#879083]">
                        JPEG or PNG · Maximum 50 MB
                      </p>
                    </>
                  )}

                  <input
                    id="plant-image"
                    type="file"
                    accept="image/jpeg,image/png"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) => {
                      handleFile(event.target.files?.[0] ?? null);
                      event.target.value = "";
                    }}
                  />
                </label>

                {selectedFile && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#397044]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e7f0e1]">✓</span>
                      Photo ready for identification
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={isLoading}
                      className="text-xs font-semibold text-[#718071] underline-offset-4 transition hover:text-[#234b35] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove photo
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || isLoading}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#19452d] px-8 py-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(25,69,45,0.12)] transition hover:bg-[#123923] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Examining your plant...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">✧</span>
                      Identify this plant
                      <span className="text-lg">→</span>
                    </>
                  )}
                </button>

                {message && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-[#eadbd3] bg-[#fbf5f1] px-4 py-3 text-sm text-[#98664e]"
                  >
                    {message}
                  </div>
                )}

                <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#7c8779]">
                  <span className="text-base">ⓘ</span>
                  Your image is sent to our identification service to find a match.
                </p>
              </form>

              {/* RESULTS */}
              {results && (
                <section className="mt-6 rounded-[26px] border border-[#dce5d8] bg-[#fffefa] p-5 shadow-[0_8px_28px_rgba(35,75,53,0.05)] sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1e4]">
                      <PlantLogo size={38} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.18em] text-[#64845d]">
                        IDENTIFICATION COMPLETE
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-[#1c3d29]">
                        Here&apos;s what we found
                      </h2>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#eaf1e4] p-5 sm:p-6">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[#477449]">
                      BEST MATCH
                    </p>
                    <h3 className="mt-2 break-words font-serif text-2xl font-bold text-[#173d28]">
                      {results.bestMatch}
                    </h3>
                  </div>

                  <div className="mt-7">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-[#234b35]">
                        Other possible matches
                      </h3>
                      <span className="text-[11px] text-[#7d897b]">Top predictions</span>
                    </div>

                    <div className="space-y-3">
                      {results.results.map((plant, index) => (
                        <div
                          key={plant.species.scientificName}
                          className="rounded-2xl border border-[#e2e9de] bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold tracking-widest text-[#66845f]">
                                MATCH {index + 1}
                              </p>
                              <h4 className="mt-1 break-words text-sm font-semibold text-[#234b35]">
                                {plant.species.scientificName}
                              </h4>
                              <p className="mt-1 text-xs text-[#788476]">
                                Family: {plant.species.family?.scientificName ?? "Unknown"}
                              </p>
                              {plant.species.commonNames?.length > 0 && (
                                <p className="mt-2 text-xs leading-5 text-[#657061]">
                                  Also known as: {plant.species.commonNames.join(", ")}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-[#eaf1e4] px-3 py-2 text-xs font-bold text-[#285d36]">
                              {(plant.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf2e9]">
                            <div
                              className="h-full rounded-full bg-[#5c9a50] transition-all duration-700"
                              style={{ width: `${plant.score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 text-xs leading-5 text-[#788476]">
                    These are possible matches, not guaranteed identifications.
                    Scores represent the model&apos;s confidence, not guaranteed probabilities.
                  </p>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-6 w-full rounded-xl border border-[#d3dfce] px-5 py-3 text-sm font-semibold text-[#234b35] transition hover:bg-[#edf2e9]"
                  >
                    Identify another plant
                  </button>
                </section>
              )}
            </div>

            {/* RIGHT-HAND INFORMATION PANEL */}
            <aside className="space-y-5">
              <div className="overflow-hidden rounded-[26px] border border-[#e0e7d9] bg-[#eaf1e3]">
                <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#f5f8ed_0%,#e4edd9_72%)] p-5">
                  <div className="absolute h-52 w-52 rounded-full bg-[#d6e5cb]/70" />
                  <div className="relative z-10 h-[245px] w-full max-w-[300px]">
                    <LeafIllustration />
                  </div>
                  <span className="absolute bottom-5 right-5 z-20 rounded-full border border-[#c8d8bf] bg-white/90 px-3 py-2 text-[9px] font-bold tracking-wider text-[#285d36] shadow-sm">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#5a9a50]" />
                    PLANT SCAN
                  </span>
                </div>
                <div className="bg-[#fffefa] px-5 py-5">
                  <h3 className="text-base font-bold text-[#1d3e29]">
                    A closer look at nature.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#687568]">
                    Every identification is a starting point for discovering
                    something new.
                  </p>
                </div>
              </div>

              <div className="rounded-[26px] border border-[#e0e7d9] bg-[#fffefa] p-5 shadow-[0_5px_20px_rgba(35,75,53,0.035)]">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-xl text-[#285d36]">✳</span>
                  <h3 className="text-sm font-bold text-[#1d3e29]">
                    Tips for better results
                  </h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5efdf] text-xs font-bold text-[#397044]">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-[#2b4932]">Focus on the plant</p>
                      <p className="mt-1 text-xs leading-5 text-[#758071]">
                        Make sure the plant is clearly visible.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5efdf] text-xs font-bold text-[#397044]">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-[#2b4932]">Use natural lighting</p>
                      <p className="mt-1 text-xs leading-5 text-[#758071]">
                        Avoid dark or blurry photographs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5efdf] text-xs font-bold text-[#397044]">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-[#2b4932]">Capture the details</p>
                      <p className="mt-1 text-xs leading-5 text-[#758071]">
                        Leaves, flowers and stems can all help.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-[26px] bg-[#19452d] p-5 text-white shadow-[0_8px_22px_rgba(25,69,45,0.12)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <PlantLogo size={43} />
                </div>
                <h3 className="mt-4 text-base font-bold">Discover more. Grow curious.</h3>
                <p className="mt-2 text-xs leading-6 text-[#d1dfce]">
                  PlantLab brings a little technology and a lot of curiosity
                  to your botanical discoveries.
                </p>
              </div>
            </aside>
          </section>

          {/* HOW IT WORKS */}
          <section className="mt-9">
            <div className="mb-4 flex items-center gap-2">
              <PlantLogo size={27} />
              <h2 className="text-base font-bold text-[#1d3e29]">How it works</h2>
            </div>
            <div className="grid gap-3 rounded-[24px] border border-[#e0e7d9] bg-[#fffefa] p-4 shadow-[0_5px_20px_rgba(35,75,53,0.025)] sm:grid-cols-3 sm:p-5">
              <div className="flex items-center gap-3 rounded-xl px-2 py-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf1e4] text-[#285d36]">
                  <CameraIcon size={26} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#294832]">1. Take a photo</p>
                  <p className="mt-1 text-xs text-[#758071]">Capture a plant you find.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border-[#e4e9e0] px-2 py-3 sm:border-l sm:pl-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf1e4] text-[#285d36]">
                  <SearchIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#294832]">2. Let us identify it</p>
                  <p className="mt-1 text-xs text-[#758071]">Discover its name.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border-[#e4e9e0] px-2 py-3 sm:border-l sm:pl-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf1e4] text-[#285d36]">
                  <span className="text-2xl">▤</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#294832]">3. Explore and learn</p>
                  <p className="mt-1 text-xs text-[#758071]">Learn more about it.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-10 flex flex-col gap-3 border-t border-[#dfe6d9] pt-5 text-[11px] text-[#879183] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 PlantLab. Made with curiosity and a little love for nature.</p>
            <p>Discover more. Grow curious.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
