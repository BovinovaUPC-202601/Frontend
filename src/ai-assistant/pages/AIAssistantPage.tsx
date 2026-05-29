import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import PetsIcon from "@mui/icons-material/Pets";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import type { Animal } from "../../animals/model/animal";
import type { AnalysisResult, ChatMessage } from "../model/ai-assistant";
import { aiAssistantService } from "../services/ai-assistant-service";

type ChatMode = "general" | "bovine";

const nowLabel = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const createMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    time: nowLabel(),
});

const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

export function AIAssistantPage() {
    const { animals, stables, fetchAnimals, fetchStables } = useGlobalStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const [chatMode, setChatMode] = useState<ChatMode>("general");
    const [selectedBovineId, setSelectedBovineId] = useState(0);
    const [generalInput, setGeneralInput] = useState("");
    const [bovineInput, setBovineInput] = useState("");
    const [chatError, setChatError] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [generalMessages, setGeneralMessages] = useState<ChatMessage[]>([
        createMessage(
            "assistant",
            "Hola, estoy listo para ayudarte con el estado general del hato, establos y campanas registradas."
        ),
    ]);
    const [bovineMessages, setBovineMessages] = useState<ChatMessage[]>([
        createMessage("assistant", "Selecciona un bovino y puedo responder con su contexto especifico."),
    ]);

    const [analysisBovineId, setAnalysisBovineId] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        fetchAnimals();
        fetchStables();
    }, [fetchAnimals, fetchStables]);

    useEffect(() => {
        if (animals.length > 0) {
            setSelectedBovineId((current) => current || animals[0].id);
            setAnalysisBovineId((current) => current || animals[0].id);
        }
    }, [animals]);

    useLayoutEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }, [generalMessages.length, bovineMessages.length, chatMode, isChatLoading]);

    const selectedBovine = useMemo(
        () => animals.find((animal) => animal.id === selectedBovineId),
        [animals, selectedBovineId]
    );

    const analysisBovine = useMemo(
        () => animals.find((animal) => animal.id === analysisBovineId),
        [animals, analysisBovineId]
    );

    const activeMessages = chatMode === "general" ? generalMessages : bovineMessages;
    const activeInput = chatMode === "general" ? generalInput : bovineInput;

    const getStableName = (animal?: Animal) =>
        stables.find((stable) => stable.id === animal?.stableId)?.name ?? "Sin establo";

    const addChatMessage = (message: ChatMessage) => {
        if (chatMode === "general") {
            setGeneralMessages((current) => [...current, message]);
            return;
        }

        setBovineMessages((current) => [...current, message]);
    };

    const setActiveInput = (value: string) => {
        if (chatMode === "general") setGeneralInput(value);
        else setBovineInput(value);
    };

    const handleChatSubmit = async (event?: FormEvent) => {
        event?.preventDefault();
        const message = activeInput.trim();
        if (!message || isChatLoading) return;

        if (chatMode === "bovine" && !selectedBovineId) {
            setChatError("Selecciona un bovino para continuar.");
            return;
        }

        setChatError("");
        setActiveInput("");
        addChatMessage(createMessage("user", message));
        setIsChatLoading(true);

        try {
            const response =
                chatMode === "general"
                    ? await aiAssistantService.sendGeneralChat(message)
                    : await aiAssistantService.sendBovineChat(selectedBovineId, message);

            addChatMessage(createMessage("assistant", response.data.response));
        } catch (error) {
            console.error(error);
            setChatError("No se pudo obtener respuesta del asistente.");
            addChatMessage(createMessage("assistant", "No pude completar la consulta. Intenta nuevamente."));
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleSuggestion = (message: string) => {
        setActiveInput(message);
    };

    const renderMessageContent = (content: string) => {
        const normalizedContent = content.replace(/^\s*\*\s+/gm, "• ");

        return normalizedContent.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
            }

            return <span key={`${part}-${index}`}>{part}</span>;
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setAnalysisResult(null);
        setAnalysisError("");

        try {
            const dataUrl = await fileToDataUrl(file);
            setImagePreview(dataUrl);
            setImageBase64(dataUrl);
        } catch (error) {
            console.error(error);
            setAnalysisError("No se pudo leer la imagen seleccionada.");
        }
    };

    const handleAnalyzePhoto = async () => {
        if (!analysisBovineId) {
            setAnalysisError("Selecciona un bovino para analizar.");
            return;
        }

        if (!imageBase64) {
            setAnalysisError("Selecciona una imagen para analizar.");
            return;
        }

        setAnalysisError("");
        setIsAnalyzing(true);

        try {
            const response = await aiAssistantService.analyzePhoto(analysisBovineId, imageBase64);
            setAnalysisResult(response.data);
        } catch (error) {
            console.error(error);
            setAnalysisError("No se pudo completar el analisis visual.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const urgencyClass = (urgency?: string) => {
        const value = urgency?.toUpperCase();
        if (value === "RED") return "bg-state-error text-white";
        if (value === "YELLOW") return "bg-state-warning text-neutral-900";
        return "bg-state-success text-white";
    };

    const urgencyLabel = (urgency?: string) => {
        const value = urgency?.toUpperCase();
        if (value === "RED") return "Alta";
        if (value === "YELLOW") return "Media";
        return "Baja";
    };

    const suggestions =
        chatMode === "general"
            ? [
                  "Cual es el estado general del hato?",
                  "Que campanas tengo registradas?",
                  "Cuantos bovinos tengo por establo?",
              ]
            : [
                  "Que sabes de este bovino?",
                  "Resume sus analisis previos.",
                  "Que deberia revisar hoy?",
              ];

    return (
        <main className="flex min-h-0 flex-1 flex-col gap-5 px-6 pb-6 font-mulish lg:px-20">
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-semibold text-neutral-700">Asistente IA</h2>
                <p className="text-sm font-semibold text-neutral-500">
                    Contexto del hato, consultas por bovino y analisis visual.
                </p>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
                <section className="flex min-h-[620px] flex-col overflow-hidden rounded-md border border-neutral-300 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 bg-brand-dark px-4 py-3 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15">
                                <SmartToyIcon />
                            </div>
                            <div>
                                <div className="text-base font-bold">
                                    {chatMode === "general" ? "Asistente Ganadero" : "Asistente por Bovino"}
                                </div>
                                <div className="text-xs font-semibold text-white/75">
                                    {chatMode === "general"
                                        ? "Datos actuales del rancho"
                                        : selectedBovine
                                          ? `${selectedBovine.name} · ${selectedBovine.breed} · ${getStableName(selectedBovine)}`
                                          : "Sin bovino seleccionado"}
                                </div>
                            </div>
                        </div>

                        <div className="flex rounded-md bg-white/10 p-1">
                            <button
                                type="button"
                                className={`rounded-sm px-3 py-1 text-sm font-bold transition ${
                                    chatMode === "general" ? "bg-white text-brand-dark" : "text-white hover:bg-white/10"
                                }`}
                                onClick={() => setChatMode("general")}
                            >
                                General
                            </button>
                            <button
                                type="button"
                                className={`rounded-sm px-3 py-1 text-sm font-bold transition ${
                                    chatMode === "bovine" ? "bg-white text-brand-dark" : "text-white hover:bg-white/10"
                                }`}
                                onClick={() => setChatMode("bovine")}
                            >
                                Bovino
                            </button>
                        </div>
                    </div>

                    {chatMode === "bovine" && (
                        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-300 bg-neutral-100 px-4 py-3">
                            <PetsIcon className="text-brand-default" />
                            <select
                                className="min-w-60 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 outline-none focus:border-brand-default"
                                value={selectedBovineId || ""}
                                onChange={(event) => setSelectedBovineId(Number(event.target.value))}
                            >
                                <option value="" disabled>
                                    Seleccionar bovino
                                </option>
                                {animals.map((animal) => (
                                    <option key={animal.id} value={animal.id}>
                                        {animal.name} · {animal.breed} · {getStableName(animal)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto bg-neutral-50 px-4 py-4">
                        <div className="flex flex-col gap-4">
                            {activeMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-brand-default text-white">
                                            <AutoAwesomeIcon className="text-base" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[78%] rounded-md px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                            message.role === "user"
                                                ? "bg-brand-default text-white"
                                                : "border border-neutral-300 bg-white text-neutral-700"
                                        }`}
                                    >
                                        <div className="whitespace-pre-wrap">{renderMessageContent(message.content)}</div>
                                        <div
                                            className={`mt-2 text-[0.68rem] font-semibold ${
                                                message.role === "user" ? "text-white/70" : "text-neutral-400"
                                            }`}
                                        >
                                            {message.time}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isChatLoading && (
                                <div className="flex items-center gap-3 text-sm font-semibold text-neutral-500">
                                    <CircularProgress size={18} color="success" />
                                    Generando respuesta
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-neutral-300 bg-white px-4 py-3">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    className="rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 hover:border-brand-default hover:text-brand-default"
                                    onClick={() => handleSuggestion(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        {chatError && (
                            <div className="mb-3 flex items-center gap-2 rounded-md bg-state-error/10 px-3 py-2 text-sm font-semibold text-state-error">
                                <ErrorOutlineIcon className="text-base" />
                                {chatError}
                            </div>
                        )}

                        <form className="flex gap-2" onSubmit={handleChatSubmit}>
                            <input
                                className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700 outline-none focus:border-brand-default"
                                value={activeInput}
                                onChange={(event) => setActiveInput(event.target.value)}
                                placeholder={
                                    chatMode === "general"
                                        ? "Consulta sobre el hato..."
                                        : selectedBovine
                                          ? `Pregunta sobre ${selectedBovine.name}...`
                                          : "Selecciona un bovino..."
                                }
                                disabled={isChatLoading}
                            />
                            <button
                                type="submit"
                                className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-default text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
                                disabled={isChatLoading || !activeInput.trim()}
                                title="Enviar"
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                </section>

                <aside className="flex min-h-[620px] flex-col gap-4">
                    <section className="rounded-md border border-neutral-300 bg-white p-4">
                        <div className="mb-4 flex items-center gap-2 text-base font-bold text-neutral-700">
                            <ImageSearchIcon className="text-brand-default" />
                            Analisis Visual con IA
                        </div>

                        <button
                            type="button"
                            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 text-center hover:border-brand-default"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Vista previa"
                                    className="h-full w-full rounded-sm object-cover"
                                />
                            ) : (
                                <>
                                    <UploadFileIcon className="text-4xl text-neutral-500" />
                                    <span className="text-sm font-bold text-neutral-600">Subir foto del bovino</span>
                                    <span className="text-xs font-semibold text-neutral-400">JPG o PNG</span>
                                </>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="mt-4 flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-neutral-500">Bovino</label>
                            <select
                                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 outline-none focus:border-brand-default"
                                value={analysisBovineId || ""}
                                onChange={(event) => setAnalysisBovineId(Number(event.target.value))}
                            >
                                <option value="" disabled>
                                    Seleccionar bovino
                                </option>
                                {animals.map((animal) => (
                                    <option key={animal.id} value={animal.id}>
                                        {animal.name} · {animal.breed} · {getStableName(animal)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedFile && (
                            <div className="mt-3 truncate text-xs font-semibold text-neutral-500">
                                {selectedFile.name}
                            </div>
                        )}

                        {analysisError && (
                            <div className="mt-3 flex items-center gap-2 rounded-md bg-state-error/10 px-3 py-2 text-sm font-semibold text-state-error">
                                <ErrorOutlineIcon className="text-base" />
                                {analysisError}
                            </div>
                        )}

                        <button
                            type="button"
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-brand-default px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
                            onClick={handleAnalyzePhoto}
                            disabled={isAnalyzing || !analysisBovineId || !imageBase64}
                        >
                            {isAnalyzing ? <CircularProgress size={18} color="inherit" /> : <ImageSearchIcon />}
                            Analizar con IA
                        </button>
                    </section>

                    <section className="flex flex-1 flex-col rounded-md border border-neutral-300 bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                                <div className="text-base font-bold text-neutral-700">Resultado del analisis</div>
                                <div className="text-xs font-semibold text-neutral-400">
                                    {analysisBovine
                                        ? `${analysisBovine.name} · ${analysisBovine.breed} · ${getStableName(analysisBovine)}`
                                        : "Sin bovino seleccionado"}
                                </div>
                            </div>
                            {analysisResult && (
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${urgencyClass(
                                        analysisResult.urgency
                                    )}`}
                                >
                                    {urgencyLabel(analysisResult.urgency)}
                                </span>
                            )}
                        </div>

                        {analysisResult ? (
                            <div className="flex flex-1 flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-md bg-neutral-100 p-3">
                                        <div className="text-xs font-bold uppercase text-neutral-400">Score</div>
                                        <div className="text-2xl font-extrabold text-neutral-800">
                                            {analysisResult.score}
                                        </div>
                                    </div>
                                    <div className="rounded-md bg-neutral-100 p-3">
                                        <div className="text-xs font-bold uppercase text-neutral-400">Confianza</div>
                                        <div className="text-2xl font-extrabold text-neutral-800">
                                            {Math.round(analysisResult.confidence * 100)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 text-sm text-neutral-600">
                                    <CheckCircleIcon className="mt-0.5 text-brand-default" fontSize="small" />
                                    <span>{analysisResult.visibleIssues}</span>
                                </div>

                                <div className="rounded-md bg-neutral-100 p-3 text-sm leading-relaxed text-neutral-600">
                                    <strong className="mb-1 block text-neutral-800">Recomendacion</strong>
                                    {analysisResult.recommendation}
                                </div>

                                <div className="mt-auto text-xs italic leading-relaxed text-neutral-400">
                                    Este analisis es orientativo. VacApp no emite diagnosticos clinicos.
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center rounded-md bg-neutral-50 px-6 text-center text-sm font-semibold text-neutral-400">
                                <ImageSearchIcon className="mb-2 text-4xl" />
                                Sin analisis reciente.
                            </div>
                        )}
                    </section>
                </aside>
            </div>
        </main>
    );
}
