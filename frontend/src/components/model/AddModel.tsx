import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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



export default function AddModel() {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<{ id: number; title: string; code: string }[]>([]);
    const { data } = useSession();
    const user = data?.user as CustomUser ;

    useEffect(() => {
        const getCategories = async () => {
            if (user?.token) {
                const fetchedCategories = await fetchCategories(user.token);
                setCategories(fetchedCategories);
            }
        };

        getCategories();
    }, [user]);
    const [modelState, setModelState] = useState({
        title: "",
        description: "",
        file: null as File | null, // Архив модели (ZIP)
        preview_image_url: "", // Для маленькой картинки карточки
        price: 0,
        category_id: 0, // Изначально 0, будет обновляться списком
        end_date: "",
        texture_url: "", // URL текстуры модели
        model_fbx: null as File | null, // FBX-модель вместо URL
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
                <form>
                    <div className="mb-2">
                        <Label htmlFor="file" className="label">Архив модели (ZIP, RAR)</Label>
                        <Input type="file" accept=".zip,.rar" className="input"/>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="title" className="label">Название</Label>
                        <Input
                            id="title"
                            value={modelState.title}
                            onChange={(e) => setModelState({...modelState, title: e.target.value})}
                            type="text" placeholder="Введите название модели.."
                            className="input"/>
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
                    </div>
                    <div className="flex justify-between space-x-5 items-center mb-2">
                        <Label htmlFor="category_id" className="label">Категория</Label>
                        <Select>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Категории</SelectLabel>
                                    {categories.map((category) => (
                                        <SelectItem key={category.code} value={category.code}>
                                            {category.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-between space-x-5 items-center mb-2">
                        <Label htmlFor="end_date">Дата окончания</Label>
                        <DatePicker/>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="texture_url" className="label">URL текстуры модели</Label>
                        <Input
                            type="file"
                            className="input"
                            accept="image/png,image/jpg,image/jpeg"
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="model_fbx" className="label">FBX-модель</Label>
                        <Input type="file" accept=".fbx" className="input"/>
                    </div>
                    <div >
                        <Button variant="destructive" type="submit" className="button w-full">Отправить</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}