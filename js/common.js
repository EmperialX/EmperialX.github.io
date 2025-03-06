const U = { s: t => { const e = document.createElement("div"); return e.textContent = t, e.innerHTML }, v: t => t && /^(challenges\/|https:\/\/(github|medium)\.com)/.test(t), c: t => t && Object.keys(t).every((e => void 0 !== t[e])), t: t => t.charAt(0).toUpperCase() + t.slice(1) }; class M { constructor(t) { this.d = [], this.c = [], this.a = "all", this.t = t, this.k = document.querySelector('meta[name="csrf-token"]')?.content } async l() { const preloader = new Preloader(); preloader.show(); try { const t = await fetch(`/data/${this.t}.json`), e = await t.json(); if (!U.c(e)) throw "Invalid data"; this.d = e[this.t], this.c = e.categories, this.r(), this.f() } catch (t) { console.error(t), this.e("Load failed") } finally { preloader.hide() } } r(t = "all") { const e = document.querySelector(`.${this.t}-showcase`); e && (e.innerHTML = this.d.filter((e => "all" === t || e.category === t)).map((t => this.m(t))).join("")) } f() { const t = document.querySelector(`.${this.t}-categories`); t && (t.innerHTML = ["all", ...this.c].map((t => `<button class="category-btn${"all" === t ? " active" : ""}" data-category="${t}">${U.t(t)}</button>`)).join(""), t.querySelectorAll(".category-btn").forEach((e => e.addEventListener("click", (() => { t.querySelectorAll(".category-btn").forEach((t => t.classList.remove("active"))), e.classList.add("active"), this.r(e.dataset.category) }))))) } e(t) { const e = document.querySelector(`.${this.t}-showcase`); e && (e.innerHTML = `<div class="error">${U.s(t)}</div>`) } } class CommonEffects { constructor() { this.progressBar = document.querySelector(".scroll-progress-bar"), this.electricLine = document.querySelector(".electric-line"), this.scrollIndicator = document.querySelector(".scroll-indicator") } updateScroll() { const t = document.documentElement.scrollHeight - window.innerHeight, e = window.scrollY / t * 100; document.documentElement.style.setProperty("--scroll-position", `${e}%`), this.progressBar && (this.progressBar.style.height = `${e}%`), this.electricLine && (this.electricLine.style.height = `${e}%`, this.electricLine.style.boxShadow = `0 0 ${10 + e / 10}px var(--ayu-accent)`), this.scrollIndicator && (this.scrollIndicator.classList.add("scrolling"), clearTimeout(window.scrollTimeout), window.scrollTimeout = setTimeout((() => { this.scrollIndicator.classList.remove("scrolling") }), 150)) } init() { let t = 0; window.addEventListener("scroll", (() => { const e = Date.now(); e - t >= 10 && (requestAnimationFrame((() => this.updateScroll())), t = e) })), this.updateScroll() } } document.addEventListener("DOMContentLoaded", (() => { (new CommonEffects).init() }));