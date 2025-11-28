import { FormFieldType, type CustomProps } from "@/lib/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

const RenderInput = ({
  field,
  props,
}: {
  field: ControllerRenderProps<FieldValues, string>;
  props: CustomProps;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <FormControl>
            <Input
              type="number"
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER: {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 21,
        today.getMonth(),
        today.getDate()
      );
      const isDob = props.name === "date_of_birth";
      return (
        <div className="flex w-full items-center">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className={`w-full justify-start text-left font-normal h-10 px-3 py-2 
                               border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-all 
                               bg-transparent hover:bg-transparent hover:text-gray-900 
                               ${!field.value && "text-gray-500"}`}
                  variant="outline"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {field.value ? (
                    field.value instanceof Date &&
                    !isNaN(field.value.getTime()) ? (
                      field.value.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    ) : (
                      props.placeholder
                    )
                  ) : (
                    <span>{props.placeholder || "Select Date"}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                captionLayout="dropdown"
                onSelect={field.onChange}
                initialFocus
                fromYear={1900}
                toYear={
                  isDob
                    ? eighteenYearsAgo.getFullYear()
                    : new Date().getFullYear()
                }
                disabled={(date) =>
                  date > (isDob ? eighteenYearsAgo : new Date()) ||
                  date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
