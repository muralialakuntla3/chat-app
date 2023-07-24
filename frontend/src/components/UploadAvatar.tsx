import { Text, Image, Space } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { Control, useController } from "react-hook-form";
import { convertImageToDataUrl } from "../lib/files";
import { notify } from "../lib/notifications";
import { UpdateUserData } from "../types";
type UploadAvatarProps = {
  control: Control<UpdateUserData>;
};

function UploadAvatar(props: UploadAvatarProps) {
  const { field } = useController<UpdateUserData>({
    name: "avatar",
    control: props.control,
  });

  const handleFilesDrop = async (files: FileWithPath[]) => {
    if (files.length < 1) {
      return;
    }
    const file = files[0];
    field.onChange(await convertImageToDataUrl(file));
  };

  return (
    <div>
      <Space h="md" />
      <Dropzone
        maxFiles={1}
        maxSize={10 * 1000} // 10kb max
        ref={field.ref}
        accept={IMAGE_MIME_TYPE}
        onReject={(files) => {
          if (files.length < 1) {
            return;
          }
          notify({
            message: files[0].errors.map((error) => error.message).join(),
            type: "warning",
          });
        }}
        onDrop={handleFilesDrop}
      >
        <Text align="center">Drop images here</Text>
        {/* TODO: Fix field.value type coming as string | boolean */}
        <Image
          width={100}
          src={String(field.value)}
          alt="User profile avatar"
        />
      </Dropzone>
    </div>
  );
}

export default UploadAvatar;
