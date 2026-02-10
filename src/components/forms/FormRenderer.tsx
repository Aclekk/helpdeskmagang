import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField as FormFieldType, generateZodSchema } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FormRendererProps {
  fields: FormFieldType[];
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const FormRenderer = ({
  fields,
  onSubmit,
  isLoading = false,
  submitLabel = "Ajukan",
}: FormRendererProps) => {
  const schema = generateZodSchema(fields);
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const renderField = (field: FormFieldType) => {
    const error = errors[field.name];
    const errorMessage = error?.message as string | undefined;

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              className="min-h-[100px] resize-none border-border bg-background text-foreground placeholder:text-muted-foreground"
              {...register(field.name)}
            />
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Select onValueChange={(value) => setValue(field.name, value)}>
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder={`Pilih ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                {field.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-popover-foreground focus:bg-accent"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              className="border-border bg-background text-foreground"
              {...register(field.name)}
            />
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );

      case "time":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="time"
              className="border-border bg-background text-foreground"
              {...register(field.name)}
            />
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              {...register(field.name)}
            />
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="file"
              className="border-border bg-background text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
              {...register(field.name)}
            />
            <p className="text-xs text-muted-foreground">
              Format: JPG, PNG, PDF (maks. 5MB)
            </p>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              {...register(field.name)}
            />
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map(renderField)}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
};

export default FormRenderer;
