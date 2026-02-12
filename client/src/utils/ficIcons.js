import {
    Disc,
    Venus,
    Mars,
    Users,
    User,
    VenusAndMars,
    BookOpen,
    PauseCircle,
    Pencil
} from "lucide-react";

export const relationshipIcons = {
    "f-f": Venus,
    "f-m": VenusAndMars,
    "m-m": Mars,
    gen: Disc,
    multi: Users,
    other: User
};

export const statusIcons = {
    ongoing: Pencil,
    completed: BookOpen,
    freezed: PauseCircle
};
