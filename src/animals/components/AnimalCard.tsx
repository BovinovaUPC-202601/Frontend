import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useAuthStore } from "../../auth/store/auth-store";
import { CollarSection } from "../../collars/components/CollarSection";
import { Animal } from "../model/animal";
import dayjs from "dayjs";
import Avatar from "@mui/material/Avatar";

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const { deleteAnimal, updateAnimal, stables } = useGlobalStore();
  const isPlus = useAuthStore((s) => s.user.subscriptionPlan === "Plus");

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(animal.name);
  const [editedGender, setEditedGender] = useState(animal.gender);
  const [editedBirthDate, setEditedBirthDate] = useState(animal.birthDate);
  const [editedBreed, setEditedBreed] = useState(animal.breed);
  const [editedStableId, setEditedStableId] = useState(animal.stableId);
  const [editedMinTemp, setEditedMinTemp] = useState(animal.minTemperature);
  const [editedMaxTemp, setEditedMaxTemp] = useState(animal.maxTemperature);
  const [editedMinHeart, setEditedMinHeart] = useState(animal.minHeartRate);
  const [editedMaxHeart, setEditedMaxHeart] = useState(animal.maxHeartRate);

  const handleSave = async () => {
    await updateAnimal({
      ...animal,
      name: editedName,
      gender: editedGender,
      birthDate: editedBirthDate,
      breed: editedBreed,
      stableId: editedStableId,
      minTemperature: editedMinTemp,
      maxTemperature: editedMaxTemp,
      minHeartRate: editedMinHeart,
      maxHeartRate: editedMaxHeart,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(animal.name);
    setEditedGender(animal.gender);
    setEditedBirthDate(animal.birthDate);
    setEditedBreed(animal.breed);
    setEditedStableId(animal.stableId);
    setEditedMinTemp(animal.minTemperature);
    setEditedMaxTemp(animal.maxTemperature);
    setEditedMinHeart(animal.minHeartRate);
    setEditedMaxHeart(animal.maxHeartRate);
    setIsEditing(false);
  };

  return (
    <Card className="bg-neutral-100 font-mulish border-1 border-neutral-300 shadow-none rounded-md">
      <CardContent>
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar
                    src={String(animal.bovineImg)}
                    className="w-15 h-15"
                  />
                  <input
                    className="text-lg font-semibold text-neutral-800 focus:outline-none bg-white border-neutral-300 border-1 py-1 px-2 w-full rounded-md"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <select
                  className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                  value={editedGender}
                  onChange={(e) => setEditedGender(e.target.value)}
                >
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
                <input
                  type="date"
                  className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                  value={editedBirthDate}
                  onChange={(e) => setEditedBirthDate(e.target.value)}
                />
                <input
                  className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                  value={editedBreed}
                  onChange={(e) => setEditedBreed(e.target.value)}
                />
                <select
                  className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                  value={editedStableId}
                  onChange={(e) => setEditedStableId(Number(e.target.value))}
                >
                  {stables.map((stable) => (
                    <option key={stable.id} value={stable.id}>
                      {stable.name}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                    value={editedMinTemp}
                    onChange={(e) => setEditedMinTemp(Number(e.target.value))}
                    placeholder="Temp Min"
                  />
                  <input
                    type="number"
                    step="0.1"
                    className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                    value={editedMaxTemp}
                    onChange={(e) => setEditedMaxTemp(Number(e.target.value))}
                    placeholder="Temp Max"
                  />
                  <input
                    type="number"
                    className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                    value={editedMinHeart}
                    onChange={(e) => setEditedMinHeart(Number(e.target.value))}
                    placeholder="HR Min"
                  />
                  <input
                    type="number"
                    className="text-sm text-neutral-500 focus:outline-none bg-white border-1 py-1 px-2 rounded-md border-neutral-300 w-full"
                    value={editedMaxHeart}
                    onChange={(e) => setEditedMaxHeart(Number(e.target.value))}
                    placeholder="HR Max"
                  />
                </div>

                {isPlus && <CollarSection bovineId={animal.id} />}
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 text-lg font-semibold text-neutral-800 py-1 px-2 w-full border-1 border-transparent">
                  <Avatar
                    src={String(animal.bovineImg)}
                    className="w-15 h-15"
                  />
                  {animal.name}
                </span>
                <span className="text-sm text-neutral-500 py-1 px-2 w-full border-1 border-transparent">
                  Género:{" "}
                  {animal.gender.toLowerCase() == "male" ? "Macho" : "Hembra"}
                </span>
                <span className="text-sm text-neutral-500 py-1 px-2 w-full border-1 border-transparent">
                  Fecha de nacimiento:{" "}
                  {dayjs(animal.birthDate).format("DD/MM/YYYY")}
                </span>
                <span className="text-sm text-neutral-500 py-1 px-2 w-full border-1 border-transparent">
                  Raza: {animal.breed}
                </span>
                <span className="text-sm text-neutral-500 py-1 px-2 w-full border-1 border-transparent">
                  Establo:{" "}
                  {stables.find((s) => s.id === animal.stableId)?.name ??
                    "Sin asignar"}
                </span>
                <span className="text-sm text-neutral-500 py-1 px-2">
                  Temp: {animal.minTemperature}°C - {animal.maxTemperature}°C
                </span>
                <span className="text-sm text-neutral-500 py-1 px-2">
                  Ritmo Card: {animal.minHeartRate} - {animal.maxHeartRate} BPM
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 items-center">
            {isEditing ? (
              <>
                <CheckIcon
                  className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-state-success"
                  onClick={handleSave}
                />
                <CloseIcon
                  className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-state-error"
                  onClick={handleCancel}
                />
              </>
            ) : (
              <>
                <EditIcon
                  className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-neutral-900"
                  onClick={() => setIsEditing(true)}
                />
                <DeleteIcon
                  className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-state-error"
                  onClick={() => deleteAnimal(animal)}
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
