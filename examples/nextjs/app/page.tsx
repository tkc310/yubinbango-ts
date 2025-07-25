'use client';

import {
  Button,
  createListCollection,
  Input,
  Box,
  Portal,
  Select,
  Heading,
} from '@chakra-ui/react';
import styles from './page.module.css';
import { Controller, useForm } from 'react-hook-form';
import { YubinBango, YUBINBANGO_PREFECTURE } from 'yubinbango-ts';

const PREFECTURE = YUBINBANGO_PREFECTURE.map(({ value, label }) => ({
  value,
  label,
}));

const PREFECTURE_COLLECTION = createListCollection({
  items: PREFECTURE,
});

export default function Home() {
  const { register, handleSubmit, setValue, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      postalCode: '',
      prefecture: '',
      city: '',
      street: '',
    },
  });

  const handleChangePostalCode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const postalCode = event.target.value;
    new YubinBango(postalCode, ({ prefecture, city, street }) => {
      const prefectureId = PREFECTURE.filter(p => p.label === prefecture)[0]
        ?.value;
      console.log({ prefectureId });
      setValue('prefecture', prefectureId);
      setValue('city', city);
      setValue('street', street);
    });
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Heading as="h1" size="lg" mb={4} textAlign="center">
          yubinbango-ts
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('postalCode')}
            type="text"
            placeholder="郵便番号を入力してください"
            onChange={handleChangePostalCode}
          />

          <Controller
            control={control}
            name="prefecture"
            render={({ field }) => (
              <Select.Root
                name={field.name}
                value={field.value ? [field.value] : []}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={PREFECTURE_COLLECTION}
                mt={4}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="都道府県を選択してください" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {PREFECTURE.map(prefecture => (
                        <Select.Item item={prefecture} key={prefecture.value}>
                          {prefecture.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            )}
          />

          <Input
            {...register('city')}
            type="text"
            placeholder="市区町村を入力してください"
            mt={4}
          />

          <Input
            {...register('street')}
            type="text"
            placeholder="番地以下を入力してください"
            mt={4}
          />

          <Box textAlign="right" mt={4}>
            <Button type="submit">送信</Button>
          </Box>
        </form>
      </main>
    </div>
  );
}
