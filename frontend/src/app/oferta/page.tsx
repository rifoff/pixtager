export default function OfertaPage() {
  return (
    <div className="min-h-screen bg-bg text-txt">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Договор публичной оферты</h1>
        <p className="text-txt-3 text-sm mb-10">ИП Андреева Полина Евгеньевна</p>

        <Section title="1. Термины и определения">
          <p><b>Оферта</b> — настоящий документ, опубликованный на сайте https://pixtager.ru/.</p>
          <p><b>Акцепт Оферты</b> — нажатие кнопки «Оплатить» под выбранным тарифом.</p>
          <p><b>Заказчик</b> — лицо, совершившее Акцепт Оферты.</p>
          <p><b>Исполнитель</b> — ИП Андреева Полина Евгеньевна.</p>
        </Section>

        <Section title="2. Предмет договора">
          <p>Исполнитель оказывает Заказчику услуги в соответствии с условиями Договора и текущими тарифами, опубликованными на сайте.</p>
          <p>Заказчик принимает услуги и полностью их оплачивает.</p>
        </Section>

        <Section title="3. Срок действия">
          <p>Договор вступает в силу со дня акцепта и действует до полного исполнения сторонами обязательств.</p>
        </Section>

        <Section title="4. Стоимость и порядок расчётов">
          <p>Стоимость услуг определяется в соответствии с действующими ценами на сайте. Оплата производится в рублях платёжной картой на сайте.</p>
        </Section>

        <Section title="5. Права и обязанности сторон">
          <p><b>Исполнитель обязуется:</b></p>
          <ul>
            <li>Оказать услуги надлежащего качества в согласованные сроки</li>
            <li>Обеспечить сохранность данных и конфиденциальность информации</li>
          </ul>
          <p><b>Заказчик обязуется:</b></p>
          <ul>
            <li>Предоставить необходимые и достоверные данные</li>
            <li>Своевременно и полностью оплатить услуги</li>
          </ul>
        </Section>

        <Section title="6. Расторжение договора">
          <p>После оплаты Заказчик вправе отказаться от услуг, направив уведомление на <a href="mailto:pixtager@mail.ru" className="text-accent hover:underline">pixtager@mail.ru</a>. Исполнитель вправе удержать стоимость уже оказанных услуг.</p>
        </Section>

        <Section title="7. Разрешение споров">
          <p>Споры разрешаются на переговорах. При недостижении согласия — в судебном порядке.</p>
        </Section>

        <Section title="8. Реквизиты">
          <div className="bg-bg-2 border border-border rounded-xl p-5 font-mono text-sm space-y-1">
            <p>ИП Андреева Полина Евгеньевна</p>
            <p>ИНН: 860103329453</p>
            <p>ОГРНИП: 323861700020942</p>
            <p>Р/с: 40802810900004443287</p>
            <p>Банк: АО «ТБанк»</p>
            <p>К/с: 30101810145250000974</p>
            <p>БИК: 044525974</p>
            <p>Email: <a href="mailto:pixtager@mail.ru" className="text-accent hover:underline">pixtager@mail.ru</a></p>
            <p>Тел.: +7 952 698 0477</p>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-txt">{title}</h2>
      <div className="space-y-3 text-[15px] text-txt-2 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  )
}