import { c as create_ssr_component, e as escape, d as each, f as add_attribute, g as compute_rest_props, h as spread, i as escape_object, b as subscribe, v as validate_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
const DoubleDropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value1 } = $$props;
  let { value2 } = $$props;
  let { values1 } = $$props;
  let { values2 } = $$props;
  let { show = true } = $$props;
  let { units = null } = $$props;
  if ($$props.value1 === void 0 && $$bindings.value1 && value1 !== void 0) $$bindings.value1(value1);
  if ($$props.value2 === void 0 && $$bindings.value2 && value2 !== void 0) $$bindings.value2(value2);
  if ($$props.values1 === void 0 && $$bindings.values1 && values1 !== void 0) $$bindings.values1(values1);
  if ($$props.values2 === void 0 && $$bindings.values2 && values2 !== void 0) $$bindings.values2(values2);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  if ($$props.units === void 0 && $$bindings.units && units !== void 0) $$bindings.units(units);
  return `${show ? `<label for="" class="form-label">${slots.default ? slots.default({}) : ``} <div class="d-flex flex-nowrap"><div><input type="text" class="form-control h-0 py-0 my-0 border-0"> <button class="btn btn-outline-secondary text-body bg-body border border-end-0 text-start dropdown-toggle w-100" type="button" style="border-top-right-radius: 0; border-bottom-right-radius: 0;" data-bs-toggle="dropdown">${escape(value1)}</button> <ul class="dropdown-menu">${each(values1, (item) => {
    return `<li><button class="dropdown-item">${escape(item)}</button> </li>`;
  })}</ul></div> <div><input type="text" class="form-control h-0 py-0 my-0 border-0"> <button class="btn btn-outline-secondary text-body bg-body border text-start dropdown-toggle w-100" style="${"border-top-left-radius: 0; border-bottom-left-radius: 0; " + escape(
    units != null ? "border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 0 !important;" : "",
    true
  )}" type="button" data-bs-toggle="dropdown">${escape(value2)}</button> <ul class="dropdown-menu">${each(values2, (item) => {
    return `<li><button class="dropdown-item">${escape(item)}</button> </li>`;
  })}</ul></div> ${units != null ? `<div><p class="px-2-5 invisible py-0 my-0 h-0" data-svelte-h="svelte-m9ka01">kWh</p> <span class="input-group-text" style="border-top-left-radius: 0; border-bottom-left-radius: 0;">${escape(units)}</span></div>` : ``}</div></label>` : ``}`;
});
const DoubleTextInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value1 } = $$props;
  let { value2 } = $$props;
  let { show = true } = $$props;
  let { units = null } = $$props;
  if ($$props.value1 === void 0 && $$bindings.value1 && value1 !== void 0) $$bindings.value1(value1);
  if ($$props.value2 === void 0 && $$bindings.value2 && value2 !== void 0) $$bindings.value2(value2);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  if ($$props.units === void 0 && $$bindings.units && units !== void 0) $$bindings.units(units);
  return `${show ? `<div class="d-flex"><label class="form-label">${slots.default ? slots.default({}) : ``} <div class="input-group"><input type="text" class="form-control border-end-0"${add_attribute("value", value1, 0)}> <input type="text" class="form-control border-end-0"${add_attribute("value", value2, 0)}> ${units != null ? `<span class="input-group-text">${escape(units)}</span>` : ``}</div></label></div>` : ``}`;
});
const Dropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { values } = $$props;
  let { value } = $$props;
  let { show = true } = $$props;
  if ($$props.values === void 0 && $$bindings.values && values !== void 0) $$bindings.values(values);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  return `${show ? `<label class="form-label d-block">${slots.default ? slots.default({}) : ``} <div class="dropdown"><button class="btn text-body bg-body border dropdown-toggle" type="button" data-bs-toggle="dropdown">${escape(value)}</button> <ul class="dropdown-menu">${each(values, (item) => {
    return `<li><button class="dropdown-item">${escape(item)}</button> </li>`;
  })}</ul></div></label>` : ``}`;
});
const TextInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "units", "show"]);
  let { value } = $$props;
  let { units = null } = $$props;
  let { show = true } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.units === void 0 && $$bindings.units && units !== void 0) $$bindings.units(units);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  return `${show ? `<label class="d-flex"><label class="form-label">${slots.default ? slots.default({}) : ``} <div class="input-group"><input${spread(
    [
      { type: "text" },
      { class: "form-control border-end-0" },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("value", value, 0)}> ${units != null ? `<span class="input-group-text border-start-0">${escape(units)}</span>` : ``}</div></label></label>` : ``}`;
});
const Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value"]);
  let { value } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  return `<div class="form-check mb-2"><label class="form-check-label"><input${spread(
    [
      { class: "form-check-input" },
      { type: "checkbox" },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("checked", value, 1)}> ${slots.default ? slots.default({}) : ``}</label></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let b;
  let vypocitanaZtrata;
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  const zdroje = ["Plynový kotel", "Elektrokotel", "Kotel na uhlí"];
  const ohrevy = ["kombinovaně i kotlem", "bojlerem"];
  const jistice = ["3x16A", "3x20A", "3x25A"];
  const cerpadla = [
    "RTC 6i",
    "RTC 13e",
    "RTC 20e",
    "EcoAir 614M",
    "EcoAir 622M",
    "EcoPart 612M",
    "EcoPart 616M",
    "EcoAir 406",
    "EcoAir 408",
    "EcoAir 410",
    "EcoAir 415",
    "EcoAir 420",
    "EcoPart 406",
    "EcoPart 408",
    "EcoPart 410",
    "EcoPart 412",
    "EcoPart 414",
    "EcoPart 417"
  ];
  let puvodniZdroj = "Kotel na uhlí";
  let cenaZP = "2.18", cenaUhli = "650", spotrebaUhli = "60", ucinnost, zpusobOhrevu = "bojlerem";
  let osob = "3", pozadovanaTeplota = "45", cirkulaceTV = false;
  let jisticPred = "3x16A", jisticPo = "3x20A";
  let cenaEeVtPred = "4.46", cenaEeNtPred = "4.21", cenaEeVtPo = "3.26", cenaEeNtPo = "3.26";
  let tepelnaZtrata = "10.2", spotreba = "2500", venkovniTeplota = "-15", teplotniSpad = "55", tc = "EcoAir 614M";
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        if (puvodniZdroj == "Plynový kotel") ucinnost = "97";
        else if (puvodniZdroj == "Elektrokotel") ucinnost = "99";
        else if (puvodniZdroj == "Kotel na uhlí") ucinnost = "75";
      }
    }
    b = Number(osob) * 40 * (Number(pozadovanaTeplota) - 10) * 1.163 * (!cirkulaceTV ? 1 : 1.3) * 365 / (1e3 * 2200);
    vypocitanaZtrata = Number(spotrebaUhli) * 100 * 1.15 * 18 * (20 - Number(venkovniTeplota)) * Number(ucinnost) / (100 * 3.6 * 24 * 215 * (20 - 3.5)) - (zpusobOhrevu == "bojlerem" ? 0 : b / 2);
    {
      {
        if (puvodniZdroj == "Kotel na uhlí") tepelnaZtrata = (Math.round(vypocitanaZtrata * 10) / 10).toFixed(1);
      }
    }
    $$rendered = `<div class="mb-2" data-svelte-h="svelte-w9wntw"><h1 class="d-inline">KVÝTEČ</h1> <h3 class="d-inline ms-2">Kalkulačka výhodnosti tepelného čerpadla</h3></div> <h4 data-svelte-h="svelte-1h398wk">Původní zdroj</h4> ${validate_component(Dropdown, "Dropdown").$$render(
      $$result,
      { values: zdroje, value: puvodniZdroj },
      {
        value: ($$value) => {
          puvodniZdroj = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(TextInput, "TextInput").$$render(
      $$result,
      {
        units: "Kč/kWh",
        show: puvodniZdroj == "Plynový kotel",
        value: cenaZP
      },
      {
        value: ($$value) => {
          cenaZP = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Cena zemního plynu:`;
        }
      }
    )} ${puvodniZdroj == "Kotel na uhlí" ? `<div class="d-flex align-items-end"><label class="form-label d-block">Spotřeba uhlí:
			<div class="input-group d-flex"><input type="text" class="form-control border-end-0"${add_attribute("value", spotrebaUhli, 0)}> <span class="input-group-text border-start-0" data-svelte-h="svelte-12oi990">q</span> <span class="input-group-text border-start-0" data-svelte-h="svelte-ue0zmi">/</span> <span class="input-group-text border-start-0" data-svelte-h="svelte-1lbcqox">rok</span></div></label> <span class="ms-2"></span> <label class="form-label d-block">Cena uhlí:
			<div class="input-group d-flex"><input type="text" class="form-control border-end-0"${add_attribute("value", cenaUhli, 0)}> <span class="input-group-text border-start-0" data-svelte-h="svelte-vsb9t1">Kč</span> <span class="input-group-text border-start-0" data-svelte-h="svelte-ue0zmi">/</span> <span class="input-group-text border-start-0" data-svelte-h="svelte-12oi990">q</span></div></label></div>` : ``} ${validate_component(TextInput, "TextInput").$$render(
      $$result,
      {
        units: "%",
        show: puvodniZdroj == "Plynový kotel",
        value: ucinnost
      },
      {
        value: ($$value) => {
          ucinnost = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Účinnost:`;
        }
      }
    )} <div class="d-flex align-items-end">${puvodniZdroj == "Kotel na uhlí" ? `<div class="me-2">${validate_component(Dropdown, "Dropdown").$$render(
      $$result,
      {
        values: ohrevy,
        show: puvodniZdroj == "Kotel na uhlí",
        value: zpusobOhrevu
      },
      {
        value: ($$value) => {
          zpusobOhrevu = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Způsob ohřevu:`;
        }
      }
    )}</div>` : ``} <div class="mb-2">${validate_component(Checkbox, "Checkbox").$$render(
      $$result,
      { value: cirkulaceTV },
      {
        value: ($$value) => {
          cirkulaceTV = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Cirkulace TV`;
        }
      }
    )}</div></div> <hr> <h4 data-svelte-h="svelte-ujdt45">Spotřeba elektrické energie</h4> ${validate_component(TextInput, "TextInput").$$render(
      $$result,
      { units: "kWh/rok", value: spotreba },
      {
        value: ($$value) => {
          spotreba = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Běžná spotřeba domácnosti: (vaření, svícení, PC, …)`;
        }
      }
    )} <div class="d-flex text-center" data-svelte-h="svelte-1u02yw0"><div><input type="text" class="form-control h-0 py-0 my-0 border-0"> <h5 class="mt-3 mb-0 w-100">Původně:</h5></div> <div><input type="text" class="form-control h-0 py-0 my-0 border-0"> <h5 class="mt-3 mb-0 w-100">Nově s TČ:</h5></div></div> ${validate_component(DoubleDropdown, "DoubleDropdown").$$render(
      $$result,
      {
        values1: jistice,
        values2: jistice,
        units: "A",
        value1: jisticPred,
        value2: jisticPo
      },
      {
        value1: ($$value) => {
          jisticPred = $$value;
          $$settled = false;
        },
        value2: ($$value) => {
          jisticPo = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Jistič:`;
        }
      }
    )} ${validate_component(DoubleTextInput, "DoubleTextInput").$$render(
      $$result,
      {
        units: "kWh",
        value1: cenaEeVtPred,
        value2: cenaEeVtPo
      },
      {
        value1: ($$value) => {
          cenaEeVtPred = $$value;
          $$settled = false;
        },
        value2: ($$value) => {
          cenaEeVtPo = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Cena EE (silovka): Vysoký tarif`;
        }
      }
    )} ${validate_component(DoubleTextInput, "DoubleTextInput").$$render(
      $$result,
      {
        units: "kWh",
        value1: cenaEeNtPred,
        value2: cenaEeNtPo
      },
      {
        value1: ($$value) => {
          cenaEeNtPred = $$value;
          $$settled = false;
        },
        value2: ($$value) => {
          cenaEeNtPo = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Cena EE (silovka): Nízký tarif`;
        }
      }
    )} <hr> <h4 data-svelte-h="svelte-1q9lp3o">Vytápění</h4> ${validate_component(TextInput, "TextInput").$$render(
      $$result,
      {
        units: "kW",
        show: puvodniZdroj != "Kotel na uhlí",
        value: tepelnaZtrata
      },
      {
        value: ($$value) => {
          tepelnaZtrata = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Tepelná ztráta budovy:`;
        }
      }
    )} ${validate_component(TextInput, "TextInput").$$render(
      $$result,
      { units: "˚C", value: venkovniTeplota },
      {
        value: ($$value) => {
          venkovniTeplota = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<span data-svelte-h="svelte-5rhbp9">Venkovní výpočtová teplota <code>t<sub>e</sub></code>:</span>`;
        }
      }
    )} <div class="d-flex align-items-end">${validate_component(TextInput, "TextInput").$$render(
      $$result,
      { units: "˚C", value: teplotniSpad },
      {
        value: ($$value) => {
          teplotniSpad = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Teplotní spád soustavy:`;
        }
      }
    )} <span class="px-3 py-3 d-flex align-items-center" data-svelte-h="svelte-es16e7">/</span> <div class="form-label d-block"><spa></spa> <div class="input-group d-flex flex-nowrap"><span class="input-group-text bg-body">${escape(Number(teplotniSpad) < 10 ? "" : Number(teplotniSpad) - 10)}</span> <span class="input-group-text border-start-0" data-svelte-h="svelte-xz8fcy">˚C</span></div></div></div> <hr> <h4 data-svelte-h="svelte-1mwni2d">Ohřev vody</h4> <div class="d-flex align-items-end">${validate_component(TextInput, "TextInput").$$render(
      $$result,
      {
        units: Number(osob) == 1 ? "osobu" : Number(osob) >= 2 && Number(osob) <= 4 ? "osoby" : "osob",
        value: osob
      },
      {
        value: ($$value) => {
          osob = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Počet osob:`;
        }
      }
    )} <div class="ms-2"></div> ${validate_component(TextInput, "TextInput").$$render(
      $$result,
      { units: "˚C", value: pozadovanaTeplota },
      {
        value: ($$value) => {
          pozadovanaTeplota = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Požadovaná teplota:`;
        }
      }
    )}</div> <hr> <p>Orientační tepelná ztráta budovy: ${escape(tepelnaZtrata)} kW</p> ${validate_component(Dropdown, "Dropdown").$$render(
      $$result,
      { values: cerpadla, value: tc },
      {
        value: ($$value) => {
          tc = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `Tepelné čerpadlo:`;
        }
      }
    )} ${`<button class="btn btn-lg btn-success" data-svelte-h="svelte-1pjm3jx">Vypočítat</button> ${``}`}`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};
