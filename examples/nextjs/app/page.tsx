'use client';

import {
  Button,
  createListCollection,
  Input,
  Portal,
  Select,
} from '@chakra-ui/react';
import styles from './page.module.css';
import { Controller, useForm } from 'react-hook-form';
import { YubinBango } from 'yubinbango-ts';

const PREFECTURE = [
  { value: '1', label: '北海道' },
  { value: '2', label: '青森県' },
  { value: '3', label: '岩手県' },
  { value: '4', label: '宮城県' },
  { value: '5', label: '秋田県' },
  { value: '6', label: '山形県' },
  { value: '7', label: '福島県' },
  { value: '8', label: '東京都' },
  { value: '9', label: '神奈川県' },
  { value: '10', label: '千葉県' },
  { value: '11', label: '埼玉県' },
  { value: '12', label: '群馬県' },
  { value: '13', label: '栃木県' },
  { value: '14', label: '茨城県' },
  { value: '15', label: '山梨県' },
  { value: '16', label: '長野県' },
  { value: '17', label: '岐阜県' },
  { value: '18', label: '静岡県' },
  { value: '19', label: '愛知県' },
  { value: '20', label: '三重県' },
  { value: '21', label: '滋賀県' },
  { value: '22', label: '京都府' },
  { value: '23', label: '大阪府' },
  { value: '24', label: '兵庫県' },
  { value: '25', label: '奈良県' },
  { value: '26', label: '和歌山県' },
  { value: '27', label: '鳥取県' },
  { value: '28', label: '島根県' },
  { value: '29', label: '岡山県' },
  { value: '30', label: '広島県' },
  { value: '31', label: '山口県' },
  { value: '32', label: '徳島県' },
  { value: '33', label: '香川県' },
  { value: '34', label: '愛媛県' },
  { value: '35', label: '高知県' },
  { value: '36', label: '福岡県' },
  { value: '37', label: '佐賀県' },
  { value: '38', label: '長崎県' },
  { value: '39', label: '熊本県' },
  { value: '40', label: '大分県' },
  { value: '41', label: '宮崎県' },
  { value: '42', label: '鹿児島県' },
  { value: '43', label: '沖縄県' },
];

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
            type="text"
            placeholder="市区町村を入力してください"
            {...register('city')}
          />

          <Input
            type="text"
            placeholder="番地以下を入力してください"
            {...register('street')}
          />
          <Button type="submit">送信</Button>
        </form>
      </main>
    </div>
  );
}
