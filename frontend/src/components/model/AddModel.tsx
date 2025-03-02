import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {UploadCloud} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {DatePicker} from "@/components/ui/date-picker";
import {useSession} from "next-auth/react";
import {CustomUser} from "@/app/api/auth/[...nextauth]/authOptions";
import {fetchCategories} from "@/dateFetch/categoryFetch";

import myAxios from "@/lib/axios.config";
import {MODEL_URL} from "@/lib/apiEndPoints";
import {useToast} from "@/hooks/use-toast";



export default function AddModel() {
    const { toast } = useToast();
    const { data } = useSession();
    const user = data?.user as CustomUser;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<CategoriesType[]>([]);
    const [modelState, setModelState] = useState<IModelFormState>({
        title: "",
        description: "",
        file: null,
        preview_image_url: null,
        price: 0,
        category_id: 0,
        end_date: null,
        texture_url: null,
        model_fbx: null,
    });
    const [errors, setErrors] = useState<IValidationErrors>({});

    useEffect(() => {
        const getCategories = async () => {
            if (user?.token) {
                const fetchedCategories = await fetchCategories(user.token);
                setCategories(fetchedCategories);
            }
        };

        getCategories();
    }, [user]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", modelState.title);
        formData.append("description", modelState.description);
        formData.append("price", modelState.price.toString());
        formData.append("category_id", modelState.category_id.toString());
        // Форматируем дату в формате YYYY-MM-DD
        if (modelState.end_date) {
            const year = modelState.end_date.getFullYear();
            const month = String(modelState.end_date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
            const day = String(modelState.end_date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            formData.append("end_date", formattedDate);
        }
        if (modelState.file) formData.append("file", modelState.file);
        if (modelState.preview_image_url) formData.append("preview_image_url", modelState.preview_image_url);
        if (modelState.texture_url) formData.append("texture_url", modelState.texture_url);
        if (modelState.model_fbx) formData.append("model_fbx", modelState.model_fbx);

        myAxios
            .post(MODEL_URL, formData, {
                headers: {
                    "Authorization": `Bearer ${user?.token}`,
                },
            })
            .then((res) => {
                setLoading(false);
                setModelState({
                    title: "",
                    description: "",
                    file: null,
                    preview_image_url: null,
                    price: 0,
                    category_id: 0,
                    end_date: null,
                    texture_url: null,
                    model_fbx: null,
                });
                setErrors({});
                setOpen(false);
                toast({
                    variant: "success",
                    description: "Модель успешно добавлена!"});
            })
            .catch((err) => {
                setLoading(false);
                if (err.response?.status === 422) {
                    setErrors(err.response?.data?.errors || {});
                } else {
                    toast({
                        variant: "destructive",
                        description:"Что-то пошло не так. Пожалуйста попробуйте заново позже!"})
                }
            });
    };

    console.log("Отправляемые данные:", {
        title: modelState.title,
        description: modelState.description,
        price: modelState.price,
        category_id: modelState.category_id,
        end_date: modelState.end_date,
        preview_image_url: modelState.preview_image_url,
        model_fbx: modelState.model_fbx,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" onClick={() => setOpen(true)}>
                    <UploadCloud />
                    Загрузить
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить модель</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <Label htmlFor="title" className="label">Название</Label>
                        <Input
                            id="title"
                            value={modelState.title}
                            onChange={(e) => setModelState({...modelState, title: e.target.value})}
                            type="text" placeholder="Введите название модели.."
                            className="input"/>
                        <span className="text-red-400">{errors.title?.[0]}</span>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="description" className="label">Описание</Label>
                        <Textarea
                            id="description"
                            value={modelState.description}
                            onChange={(e) => setModelState({...modelState, description: e.target.value})}
                            placeholder="Введите описание модели.."
                            rows={5}
                            className="textarea">
                        </Textarea>
                        <span className="text-red-400">{errors.description?.[0]}</span>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="price" className="label">Цена</Label>
                        <Input
                            id="price"
                            onChange={(e) => setModelState({...modelState, price: parseFloat(e.target.value) || 0})}
                            value={modelState.price}
                            type="number"
                            placeholder="Введите цену модели.."
                            min="0" className="input"
                            disabled={true}
                        />
                        <span className="text-red-400">{errors.price?.[0]}</span>
                    </div>
                    <div className="mb-2">
                        <div className="flex justify-between space-x-5 items-center">
                            <Label htmlFor="category_id" className="label">Категория</Label>
                            <Select onValueChange={(value) => setModelState({ ...modelState, category_id: Number(value) })} // Преобразуйте значение в число
                                    value={modelState.category_id?.toString() || ""}> {/* Преобразуйте в строку для отображения */}
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Категории</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem key={category.code} value={category.id.toString()}>
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="text-red-400">{errors.category_id?.[0]}</span>
                    </div>
                    <div className=" mb-2">
                        <div className="flex justify-between space-x-5 items-center">
                            <Label htmlFor="end_date">Дата окончания</Label>
                            <DatePicker
                                date={modelState.end_date}
                                setDate={(date) => setModelState({ ...modelState, end_date: date || null })}
                            />
                        </div>
                        <span className="text-red-400">{errors.end_date?.[0]}</span>
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="preview_image_url">Превью изображения</Label>
                        <Input
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            onChange={(e) =>
                                setModelState({ ...modelState, preview_image_url: e.target.files?.[0] || null })
                            }
                        />
                        <span className="text-red-400">{errors.preview_image_url?.[0]}</span>
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="file" className="label">Архив модели (ZIP, RAR)</Label>
                        <Input type="file" accept=".zip,.rar" className="input"/>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="texture_url" className="label">Текстура модели</Label>
                        <Input
                            type="file"
                            className="input"
                            accept="image/png,image/jpg,image/jpeg"
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="model_fbx" className="label">FBX-модель</Label>
                        <Input
                            type="file"
                            accept=".fbx"
                            className="input"
                            onChange={(e) => setModelState({ ...modelState, model_fbx: e.target.files?.[0] || null })}
                        />
                    </div>
                    <div >
                        <Button variant="destructive" type="submit" className="button w-full">Отправить</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}