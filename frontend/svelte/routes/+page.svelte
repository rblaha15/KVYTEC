<script lang="ts">
	import DoubleDropdown from './DoubleDropdown.svelte';
	import Dropdown from './Dropdown.svelte';
	import Checkbox from './Checkbox.svelte';
	import { dev } from '$app/environment';
	const apiUrl = import.meta.env.VITE_API_URL;

	const fieldNameMapping = {
    puvodniZdroj: "Původní zdroj",
    cenaZP: "Cena zemního plynu",
    cenaUhli: "Cena uhlí",
    spotrebaUhli: "Spotřeba uhlí",
    ucinnost: "Účinnost",
    zpusobOhrevu: "Způsob ohřevu",
    osob: "Počet osob",
    pozadovanaTeplota: "Požadovaná teplota",
    cirkulaceTV: "Cirkulace TV",
    jisticPred: "Jistič před",
    jisticPo: "Jistič po",
    cenaEeVtPred: "Cena EE VT před",
    cenaEeNtPred: "Cena EE NT před",
    cenaEeVtPo: "Cena EE VT po",
    cenaEeNtPo: "Cena EE NT po",
    tepelnaZtrata: "Tepelná ztráta",
    spotreba: "Spotřeba",
    venkovniTeplota: "Venkovní teplota",
    teplotniSpad: "Teplotní spád",
    tc: "TČ",
};


	let validationErrors: { [key: string]: string } = {}; // Maps field names to error messages

	const validateNumberInput = (
    event: Event,
    fieldName: keyof typeof fieldNameMapping, // Ensure fieldName is one of the keys from fieldNameMapping
    setValue: (value: string) => void,
    maxLength: number
) => {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Allow negative numbers (optional '-') and numbers with optional decimal point
    if (!/^-?\d*\.?\d*$/.test(value)) {
        validationErrors[fieldName] = "Neplatný vstup: vstup musí být číslo.";
        input.value = value.slice(0, -1); // Remove last character if it's invalid
    } else if (value.length > maxLength) { // Check for max length
        const friendlyName = fieldNameMapping[fieldName] || fieldName; // Get user-friendly name
        validationErrors[fieldName] = `Dosáhli jste maximální povolené hodnoty pro pole ${friendlyName}.`;
        input.value = value.slice(0, maxLength); // Truncate the value to max length
    } else {
        validationErrors[fieldName] = ""; // Clear error if valid
    }

    // Update the bound variable
    setValue(input.value);
};




	const zdroje = ['Plynový kotel', 'Elektrokotel', 'Kotel na uhlí'] as const;
	const ohrevy = ['kombinovaně i kotlem', 'bojlerem'] as const;
	const jistice = ['3x16A', '3x20A', '3x25A'] as const;
	const cerpadla = [
		'RTC 6i',
		'RTC 13e',
		'RTC 20e',
		'EcoAir 614M',
		'EcoAir 622M',
		'EcoPart 612M',
		'EcoPart 616M',
		'EcoAir 406',
		'EcoAir 408',
		'EcoAir 410',
		'EcoAir 415',
		'EcoAir 420',
		'EcoPart 406',
		'EcoPart 408',
		'EcoPart 410',
		'EcoPart 412',
		'EcoPart 414',
		'EcoPart 417'
	] as const;

	let puvodniZdroj: (typeof zdroje)[number] = 'Kotel na uhlí';
	let cenaZP: string = '2.18',
		cenaUhli: string = '650',
		spotrebaUhli: string = '60',
		ucinnost: string,
		zpusobOhrevu: (typeof ohrevy)[number] = 'bojlerem';
	let osob: string = '3',
		pozadovanaTeplota: string = '45',
		cirkulaceTV: boolean = false;
	let jisticPred: (typeof jistice)[number] = '3x16A',
		jisticPo: (typeof jistice)[number] = '3x20A';
	let cenaEeVtPred: string = '4.46',
		cenaEeNtPred: string = '4.21',
		cenaEeVtPo: string = '3.26',
		cenaEeNtPo: string = '3.26';
	let tepelnaZtrata: string | null = '10.2',
		spotreba: string = '2500',
		venkovniTeplota: string = '-15',
		teplotniSpad: string = '55',
		tc: (typeof cerpadla)[number] = 'EcoAir 614M';

	$: {
		if (puvodniZdroj == 'Plynový kotel') ucinnost = '97';
		else if (puvodniZdroj == 'Elektrokotel') ucinnost = '99';
		else if (puvodniZdroj == 'Kotel na uhlí') ucinnost = '75';
	}

	$: b =
		(Number(osob) *
			40 *
			(Number(pozadovanaTeplota) - 10) *
			1.163 *
			(!cirkulaceTV ? 1 : 1.3) *
			365) /
		(1000 * 2200);
	$: vypocitanaZtrata =
		(Number(spotrebaUhli) * 100 * 1.15 * 18 * (20 - Number(venkovniTeplota)) * Number(ucinnost)) /
			(100 * 3.6 * 24 * 215 * (20 - 3.5)) -
		(zpusobOhrevu == 'bojlerem' ? 0 : b / 2);

	$: {
		if (puvodniZdroj == 'Kotel na uhlí')
			tepelnaZtrata = (Math.round(vypocitanaZtrata * 10) / 10).toFixed(1);
	}

	$: {
    if (puvodniZdroj) {
        validationErrors = {};  // Clear all validation errors when the source changes
    }
}

	type Response = {
		nakladyVytapeniTVPred: number;
		nakladyVytapeniTVPo: number;
		nakladyOstatniPred: number;
		nakladyOstatniPo: number;
	};

	let loading: boolean = false;
	let vysledek: null | Response = dev
		? {
				nakladyVytapeniTVPred: 12,
				nakladyVytapeniTVPo: 12,
				nakladyOstatniPred: 12,
				nakladyOstatniPo: 12
			}
		: null;

	let errorMessage: string | null = null; // New variable for error messages


	const vypocitat = async () => {
		loading = true;
		vysledek = null;
		errorMessage = null; // Reset error message
		const response = await fetch(`${apiUrl}/compute`,
			{
				method: 'POST',
				body: JSON.stringify({
					puvodniZdroj:
						puvodniZdroj == 'Kotel na uhlí' ? '3' : puvodniZdroj == 'Elektrokotel' ? '2' : '1',
					cenaZP: puvodniZdroj == 'Plynový kotel' ? cenaZP : '0',
					cenaUhli: puvodniZdroj == 'Kotel na uhlí' ? cenaUhli : '0',
					spotrebaUhli,
					ucinnost: String(Number(ucinnost) / 100),
					zpusobOhrevu,
					osob,
					pozadovanaTeplota,
					cirkulaceTV: cirkulaceTV ? 'ano' : 'ne',
					jisticPred,
					jisticPo,
					cenaEeVtPred,
					cenaEeNtPred,
					cenaEeVtPo,
					cenaEeNtPo,
					tepelnaZtrata,
					spotreba,
					venkovniTeplota,
					teplotniSpad,
					tc
				})
			}
		);

		loading = false; 

		if (!response.ok) {
		if (response.status === 400) {
			errorMessage = "Chyba validace dat, poskytněte platná data.";
		} else {
			errorMessage = "Nastala chyba při výpočtu.";
		}
	} else {
		vysledek = await response.json() as Response; // Process the successful response
	}
		};



	
</script>

<div class="mb-2">
	<h1 class="d-inline">KVÝTEČ</h1>
	<h3 class="d-inline ms-2">Kalkulačka výhodnosti tepelného čerpadla</h3>
</div>
<h4>Původní zdroj</h4>
<Dropdown values={zdroje} bind:value={puvodniZdroj} />

{#if puvodniZdroj == 'Plynový kotel'}

<div class="d-flex align-items-end">
	<label class="form-label d-block">
	Cena zemního plynu: 
		<div class="input-group d-flex">
		<input 
			id="cenaZP" 
			type="text" 
			class="form-control" 
			bind:value={cenaZP} 
			on:input={e => validateNumberInput(e, 'cenaZP', value => cenaZP = value, 5)} 
			/>
		<span class="input-group-text border-start-0">Kč/kWh</span>
	</div>
	{#if validationErrors['cenaZP']}
	<div class="error">{validationErrors['cenaZP']}</div>
	{/if}
	</label>
</div>

{/if}




{#if puvodniZdroj == 'Kotel na uhlí'}
	<div class="d-flex align-items-end">
		<label class="form-label d-block">
			Spotřeba uhlí:
			<div class="input-group d-flex">
				<input 
					type="text" 
					class="form-control border-end-0" 
					bind:value={spotrebaUhli} 
					on:input={e => validateNumberInput(e, 'spotrebaUhli', value => spotrebaUhli = value, 5)}  
					/>
				<span class="input-group-text border-start-0">q</span>
				<span class="input-group-text border-start-0">/</span>
				<span class="input-group-text border-start-0">rok</span>
			</div>
			{#if validationErrors['spotrebaUhli']}
			<div class="error">{validationErrors['spotrebaUhli']}</div>
			{/if}
		</label>
		<span class="ms-2"></span>
		<label class="form-label d-block">
			Cena uhlí:
			<div class="input-group d-flex">
				<input 
					type="text" 
					class="form-control border-end-0" 
					bind:value={cenaUhli} 
					on:input={e => validateNumberInput(e, 'cenaUhli', value => cenaUhli = value, 5)}  
					/>
				<span class="input-group-text border-start-0">Kč</span>
				<span class="input-group-text border-start-0">/</span>
				<span class="input-group-text border-start-0">q</span>
			</div>
			{#if validationErrors['cenaUhli']}
			<div class="error">{validationErrors['cenaUhli']}</div>
			{/if}
		</label>
	</div>
{/if}

{#if puvodniZdroj == 'Plynový kotel'}
    <label>
        Účinnost:
        <div class="input-group">
            <input 
                type="text" 
                class="form-control" 
                bind:value={ucinnost} 

				on:input={e => validateNumberInput(e, 'ucinnost', value => ucinnost = value,2)}  
				/>
            <span class="input-group-text">%</span>
        </div>
		{#if validationErrors['ucinnost']}
			<div class="error">{validationErrors['ucinnost']}</div>
		{/if}
    </label>
{/if}

<div class="d-flex align-items-end">
	{#if puvodniZdroj == 'Kotel na uhlí'}
		<div class="me-2">
			<Dropdown values={ohrevy} bind:value={zpusobOhrevu} show={puvodniZdroj == 'Kotel na uhlí'}
				>Způsob ohřevu:</Dropdown
			>
		</div>
	{/if}
	<div class="mb-2">
		<Checkbox bind:value={cirkulaceTV}>Cirkulace TV</Checkbox>
	</div>
</div>
<hr />
<h4>Spotřeba elektrické energie</h4>

<label>
	Běžná spotřeba domácnosti: (vaření, svícení, PC, …)
	<div class="input-group">
		<input 
			id = "spotreba"
			type="number" 
			class="form-control" 
			bind:value={spotreba} 

			on:input={e => validateNumberInput(e, 'spotreba', value => spotreba = value, 8)} 
			/>
            <span class="input-group-text">kWh/rok</span>
		</div>
		{#if validationErrors['spotreba']}
			<div class="error">{validationErrors['spotreba']}</div>
		{/if}
</label>


<div class="d-flex text-center">
	<div>
		<input type="text" class="form-control h-0 py-0 my-0 border-0" />
		<h5 class="mt-3 mb-0 w-100">Původně:</h5>
	</div>
	<div>
		<input type="text" class="form-control h-0 py-0 my-0 border-0" />
		<h5 class="mt-3 mb-0 w-100">Nově s TČ:</h5>
	</div>
</div>

<DoubleDropdown
	bind:value1={jisticPred}
	bind:value2={jisticPo}
	values1={jistice}
	values2={jistice}
	units="A">Jistič:</DoubleDropdown
>
<div class="d-flex">
	<label class="form-label">
		Cena EE (silovka): Vysoký tarif
		<div class="input-group">
			<!-- First input for 'cenaEeVtPred' -->
			<input 
				type="text" 
				class="form-control border-end-0" 
				bind:value={cenaEeVtPred} 
				on:input={e => validateNumberInput(e, 'cenaEeVtPred', value => cenaEeVtPred = value, 5)} 
			/>
			
			<!-- Second input for 'cenaEeVtPo' -->
			<input 
				type="text" 
				class="form-control border-end-0" 
				bind:value={cenaEeVtPo} 
				on:input={e => validateNumberInput(e, 'cenaEeVtPo', value => cenaEeVtPo = value, 5)} 
			/>
			
			<!-- Units display -->
			<span class="input-group-text">kWh</span>
		</div>
	</label>
</div>

<!-- Validation Error for 'cenaEeVtPred' -->
{#if validationErrors['cenaEeVtPred']}
	<div class="error">{validationErrors['cenaEeVtPred']}</div>
{/if}

<!-- Validation Error for 'cenaEeVtPo' -->
{#if validationErrors['cenaEeVtPo']}
	<div class="error">{validationErrors['cenaEeVtPo']}</div>
{/if}


<div class="d-flex">
	<label class="form-label">
		Cena EE (silovka): Nízký tarif
		<div class="input-group">
			<!-- First input for 'cenaEeNtPred' -->
			<input 
				type="text" 
				class="form-control border-end-0" 
				bind:value={cenaEeNtPred} 
				on:input={e => validateNumberInput(e, 'cenaEeNtPred', value => cenaEeNtPred = value, 5)} 
			/>
			
			<!-- Second input for 'cenaEeNtPo' -->
			<input 
				type="text" 
				class="form-control border-end-0" 
				bind:value={cenaEeNtPo} 
				on:input={e => validateNumberInput(e, 'cenaEeNtPo', value => cenaEeNtPo = value, 5)} 
			/>
			
			<!-- Units display -->
				<span class="input-group-text">kWh</span>
		</div>
	</label>
</div>

<!-- Validation Error for 'cenaEeNtPred' -->
{#if validationErrors['cenaEeNtPred']}
	<div class="error">{validationErrors['cenaEeNtPred']}</div>
{/if}

<!-- Validation Error for 'cenaEeNtPo' -->
{#if validationErrors['cenaEeNtPo']}
	<div class="error">{validationErrors['cenaEeNtPo']}</div>
{/if}


<hr />
<h4>Vytápění</h4>
{#if puvodniZdroj != 'Kotel na uhlí'}
	<div class="d-flex">
		<label class="form-label">
			Tepelná ztráta budovy:
			<div class="input-group">
				<!-- Input for 'tepelnaZtrata' -->
				<input 
					type="text" 
					class="form-control border-end-0" 
					bind:value={tepelnaZtrata} 
					on:input={e => validateNumberInput(e, 'tepelnaZtrata', value => tepelnaZtrata = value, 5)} 
				/>
				
				<!-- Units display -->
					<span class="input-group-text">kWh</span>
			</div>
		</label>
	</div>

	<!-- Validation Error for 'tepelnaZtrata' -->
	{#if validationErrors['tepelnaZtrata']}
		<div class="error">{validationErrors['tepelnaZtrata']}</div>
	{/if}
{/if}

<div class="d-flex">
	<label class="form-label">
		<span>Venkovní výpočtová teplota <code>t<sub>e</sub></code>:</span>
		<div class="input-group">
			<!-- Input for 'venkovniTeplota' -->
			<input 
				type="text" 
				class="form-control border-end-0" 
				bind:value={venkovniTeplota} 
				on:input={e => validateNumberInput(e, 'venkovniTeplota', value => venkovniTeplota = value, 3)}
			/>

			<!-- Units display -->
				<span class="input-group-text">˚C</span>
		</div>
	</label>
</div>

<!-- Validation Error for 'venkovniTeplota' -->
{#if validationErrors['venkovniTeplota']}
	<div class="error">{validationErrors['venkovniTeplota']}</div>
{/if}



<div class="d-flex align-items-end">
	<div class="d-flex">
		<label class="form-label">
			Teplotní spád soustavy:
			<div class="input-group">
				<!-- Input for 'teplotniSpad' -->
				<input 
					type="text" 
					class="form-control border-end-0" 
					bind:value={teplotniSpad} 
					on:input={e => validateNumberInput(e, 'teplotniSpad', value => teplotniSpad = value, 2)}
				/>
	
				<!-- Units display -->
					<span class="input-group-text">˚C</span>
			</div>
		</label>
	</div>

	
	<span class="px-3 py-3 d-flex align-items-center">/</span>
	<div class="form-label d-block">
		<spa />
		<div class="input-group d-flex flex-nowrap">
			<span class="input-group-text bg-body"
				>{Number(teplotniSpad) < 10 ? '' : Number(teplotniSpad) - 10}</span
			>
			<span class="input-group-text border-start-0">˚C</span>
		</div>
	</div>
</div>
<!-- Validation Error for 'teplotniSpad' -->
{#if validationErrors['teplotniSpad']}
	<div class="error">{validationErrors['teplotniSpad']}</div>
{/if}

<hr />
<h4>Ohřev vody</h4>
<div class="d-flex align-items-end">
	<div class="d-flex">
		<label class="form-label">
			Počet osob:
			<div class="input-group">
				<!-- Input for 'osob' -->
				<input 
					type="text" 
					class="form-control border-end-0" 
					bind:value={osob} 
					on:input={e => validateNumberInput(e, 'osob', value => osob = value, 3)} 
				/>
	
				<!-- Units display based on the number of people -->
				<span class="input-group-text">
					{Number(osob) == 1 ? 'osobu' : Number(osob) >= 2 && Number(osob) <= 4 ? 'osoby' : 'osob'}
				</span>
			</div>
		</label>
	</div>
	
	<!-- Add margin to the second field to create a gap -->
	<div class="d-flex ms-3">
		<label class="form-label">
			Požadovaná teplota:
			<div class="input-group">
				<!-- Input for 'pozadovanaTeplota' -->
				<input 
					type="text" 
					class="form-control border-end-0" 
					bind:value={pozadovanaTeplota} 
					on:input={e => validateNumberInput(e, 'pozadovanaTeplota', value => pozadovanaTeplota = value, 2)}
				/>
	
				<!-- Units display -->
				<span class="input-group-text">˚C</span>
			</div>
		</label>
	</div>
</div>
	<!-- Validation Error for 'pozadovanaTeplota' -->
	{#if validationErrors['pozadovanaTeplota']}
		<div class="error">{validationErrors['pozadovanaTeplota']}</div>
	{/if}

	<!-- Validation Error for 'osob' -->
	{#if validationErrors['osob']}
		<div class="error">{validationErrors['osob']}</div>
	{/if}
	

<hr />
<p>Orientační tepelná ztráta budovy: {tepelnaZtrata} kW</p>
<Dropdown values={cerpadla} bind:value={tc}>Tepelné čerpadlo:</Dropdown>

{#if loading}
	<div class="d-inline-flex align-content-center text-break mt-2 mt-sm-0">
		<div class="spinner-border text-danger ms-2"></div>
		<p class="ms-2 my-auto">Počítání…</p>
	</div>
{:else}
    <button class="btn btn-lg btn-success" on:click={vypocitat}>Vypočítat</button>
		{#if errorMessage}
			<div class="alert alert-danger mt-2">{errorMessage}</div> 
		{/if}
		{#if vysledek != null}
			{@const nakladyPred = vysledek.nakladyVytapeniTVPred + vysledek.nakladyOstatniPred}
			{@const nakladyPo = vysledek.nakladyVytapeniTVPo + vysledek.nakladyOstatniPo}
			{@const uspora = nakladyPred - nakladyPo}
			<div>
				<div class="d-flex text-center">
					<p class="w-60"></p>
					<h5 class="w-20 min mx-2">Původně:</h5>
					<h5 class="w-20 min">Nově s TČ:</h5>
				</div>
				<div class="d-flex align-items-center">
					<p class="w-60"><b>Náklady na vytápění a ohřev vody:</b></p>
					<p class="w-20 min mx-2 text-center">{vysledek.nakladyVytapeniTVPred.toLocaleString()} Kč</p>
					<p class="w-20 min text-center">{vysledek.nakladyVytapeniTVPo.toLocaleString()} Kč</p>
				</div>
				<div class="d-flex align-items-center">
					<p class="w-60"><b>Náklady na ostatní spotřebiče (včetně stálých plateb):</b></p>
					<p class="w-20 min mx-2 text-center">{vysledek.nakladyOstatniPred.toLocaleString()} Kč</p>
					<p class="w-20 min text-center">{vysledek.nakladyOstatniPo.toLocaleString()} Kč</p>
				</div>
				<div class="d-flex align-items-center">
					<p class="w-60"><b>Celkové náklady:</b></p>
					<p class="w-20 min mx-2 text-center">{nakladyPred.toLocaleString()} Kč</p>
					<p class="w-20 min text-center">{nakladyPo.toLocaleString()} Kč</p>
				</div>
				<div class="d-flex fs-4 align-items-center">
					<p class="w-60"><b>Celková úspora při přechodu na tepelné čerpadlo:</b></p>
					<p class="w-40 ms-2 text-center">{uspora.toLocaleString()} Kč</p>
				</div>
			</div>
		{/if}
{/if}


