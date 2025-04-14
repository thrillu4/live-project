document.addEventListener('DOMContentLoaded', () => {
	// particleJs
	const body = document.querySelector('body')

	particlesJS.load('particles-js', './assets/particlesjs-light.json')
	// lazy loading
	const iframes = document.querySelectorAll('iframe')

	const loadIframe = (iframe) => {
		iframe.src = iframe.dataset.src
	}

	const unloadIframe = (iframe) => {
		iframe.src = ''
	}

	const observer = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					loadIframe(entry.target)
				} else {
					unloadIframe(entry.target)
				}
			})
		},
		{
			rootMargin: '0px',
			threshold: 0.1,
		}
	)

	iframes.forEach((iframe) => observer.observe(iframe))

	//dark mode
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
	const localModeValue = JSON.parse(localStorage.getItem('mode'))

	const switcher = document.querySelector('.controls__theme-btn'),
		root = document.documentElement,
		images = document.querySelectorAll('.theme-img')

	switcher.addEventListener('click', () => {
		body.classList.toggle('darkmode')
		themeLoader()
		localStorage.setItem(
			'mode',
			JSON.stringify(body.classList.contains('darkmode') ? 'dark' : 'light')
		)
	})

	if (!localModeValue) {
		if (isDarkMode) {
			body.classList.add('darkmode')
			themeLoader()
		}
	} else if (localModeValue === 'dark') {
		body.classList.add('darkmode')
		themeLoader()
	}

	function themeLoader() {
		if (body.classList.contains('darkmode')) {
			particlesJS.load('particles-js', './assets/particlesjs-dark.json')
			root.style.setProperty('--light-color', 'rgb(32, 27, 39)')
			root.style.setProperty('--dark-color', 'rgb(255, 190, 190)')
			images.forEach((img) => (img.src = img.dataset.dark))
		} else {
			particlesJS.load('particles-js', './assets/particlesjs-light.json')
			root.style.setProperty('--light-color', 'rgb(255, 190, 190)')
			root.style.setProperty('--dark-color', 'rgb(32, 27, 39)')
			images.forEach((img) => (img.src = img.dataset.light))
		}
	}

	// translation

	const langButton = document.querySelector('.controls__lang-btn'),
		currLangDisplay = document.querySelector('.controls__lang-curr')
	let translate = {}
	let currentLang = 'en'
	const localLangValue = localStorage.getItem('lang')

	if (localLangValue) {
		currLangDisplay.textContent = localLangValue
		currentLang = localLangValue
		fetchData()
	}

	async function fetchData() {
		try {
			const res = await fetch('./assets/translation.json')
			translate = await res.json()
			applyTranslations()
		} catch (error) {
			console.log('Something getting wrong!' + error)
		}
	}

	function applyTranslations() {
		const elements = document.querySelectorAll('[data-translate]')

		elements.forEach((el) => {
			const key = el.getAttribute('data-translate')
			if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
				el.placeholder = translate[currentLang][key]
			} else {
				el.textContent = translate[currentLang][key]
			}
		})
	}

	langButton.addEventListener('click', () => {
		currentLang =
			currentLang === 'en' ? 'ru' : currentLang === 'ru' ? 'ua' : 'en'
		currLangDisplay.textContent = currentLang
		localStorage.setItem('lang', currentLang)
		fetchData()
	})
})
