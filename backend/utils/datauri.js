import datauriparser from './datauriparser.js';
import path from "path";

const parser = new datauriparser();

const getDataUri = (file) => {
    const buffer = file.buffer;
    return parser.format(path.extname(file.originalname).toLowerCase().toString(), buffer).content;
}

export default getDataUri;