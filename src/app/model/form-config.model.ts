export interface FieldConfig {
  configId?:       string;
  fieldName:       string;
  label:           string;
  fieldType:       'text' | 'number' | 'date' | 'select' | 'checkbox';
  visible:         boolean;
  required:        boolean;
  fieldOrder:      number;
  maxLength?:      number | null;
  patternRegex?:   string | null;
  patternMessage?: string | null;
  fieldOptions?:   string | null;
  entityType:      string;
  hotel?:          { hotelId: string };
}
