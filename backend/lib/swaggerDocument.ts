import path from "path";
import YAML from "yamljs";

const documentPath = path.join(__dirname, "../src/openapi.yaml");
const swaggerDocument = YAML.load(documentPath);

export default swaggerDocument;
