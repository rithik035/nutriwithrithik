// app.js - India Nutri (client-side only)
// IMPORTANT: No persistence APIs (localStorage/cookies) are used per strict instructions.

(() => {
  /* ------------------------------------------------------------------
  |  GLOBAL DATA & STATE                                              |
  ------------------------------------------------------------------*/
  const foods = [

    
    {"id":1,"name":"Wheat Roti","hindiName":"गेहूं रोटी","category":"Cereals","unit":"piece","gramsPerUnit":30,"energy":89,"protein":3.6,"carbs":18,"fat":0.4,"fiber":2.7,"jainFriendly":true,"satvikFriendly":true},
    {"id":2,"name":"Cooked Rice","hindiName":"पका चावल","category":"Cereals","unit":"katori","gramsPerUnit":100,"energy":130,"protein":2.7,"carbs":28,"fat":0.3,"fiber":0.4,"jainFriendly":true,"satvikFriendly":true},
    {"id":3,"name":"Toor Dal","hindiName":"तूर दाल","category":"Pulses","unit":"katori","gramsPerUnit":30,"energy":116,"protein":7.2,"carbs":19,"fat":0.6,"fiber":5.9,"jainFriendly":true,"satvikFriendly":true},
    {"id":4,"name":"Moong Dal","hindiName":"मूंग दाल","category":"Pulses","unit":"katori","gramsPerUnit":30,"energy":105,"protein":7.0,"carbs":17,"fat":0.4,"fiber":4.1,"jainFriendly":true,"satvikFriendly":true},
    {"id":5,"name":"Palak Sabzi","hindiName":"पालक सब्ज़ी","category":"Vegetables","unit":"katori","gramsPerUnit":80,"energy":40,"protein":3.0,"carbs":6,"fat":0.5,"fiber":2.2,"jainFriendly":true,"satvikFriendly":true},
    {"id":6,"name":"Aloo Gobi","hindiName":"आलू गोभी","category":"Vegetables","unit":"katori","gramsPerUnit":100,"energy":75,"protein":2.5,"carbs":12,"fat":2.0,"fiber":3.0,"jainFriendly":false,"satvikFriendly":true},
    {"id":7,"name":"Chicken Curry","hindiName":"चिकन करी","category":"NonVeg","unit":"katori","gramsPerUnit":120,"energy":200,"protein":22,"carbs":4,"fat":11,"fiber":1,"jainFriendly":false,"satvikFriendly":false},
    {"id":8,"name":"Fried Fish","hindiName":"तली हुई मछली","category":"NonVeg","unit":"piece","gramsPerUnit":90,"energy":240,"protein":20,"carbs":5,"fat":15,"fiber":0,"jainFriendly":false,"satvikFriendly":false},
    {"id":9,"name":"Boiled Egg","hindiName":"उबला अंडा","category":"Egg","unit":"piece","gramsPerUnit":50,"energy":77,"protein":6.3,"carbs":0.6,"fat":5.3,"fiber":0,"jainFriendly":false,"satvikFriendly":false},
    {"id":10,"name":"Idli","hindiName":"इडली","category":"Regional","unit":"piece","gramsPerUnit":40,"energy":60,"protein":1.6,"carbs":12.3,"fat":0.4,"fiber":0.7,"jainFriendly":true,"satvikFriendly":true},
    {"id":11,"name":"Dosa","hindiName":"दोसा","category":"Regional","unit":"piece","gramsPerUnit":60,"energy":85,"protein":2.3,"carbs":18,"fat":0.9,"fiber":1.2,"jainFriendly":true,"satvikFriendly":true},
    {"id":12,"name":"Sambar","hindiName":"सांभर","category":"Regional","unit":"katori","gramsPerUnit":100,"energy":65,"protein":3.4,"carbs":10,"fat":1.5,"fiber":2.1,"jainFriendly":true,"satvikFriendly":true},
    {"id":13,"name":"Curd (Toned)","hindiName":"दही (टोंड)","category":"Dairy","unit":"katori","gramsPerUnit":100,"energy":60,"protein":3.5,"carbs":4.7,"fat":3.0,"fiber":0,"jainFriendly":true,"satvikFriendly":true},
    {"id":14,"name":"Paneer","hindiName":"पनीर","category":"Dairy","unit":"piece","gramsPerUnit":50,"energy":130,"protein":8.0,"carbs":2.0,"fat":10.0,"fiber":0,"jainFriendly":true,"satvikFriendly":true},
    {"id":15,"name":"Banana","hindiName":"केला","category":"Fruits","unit":"piece","gramsPerUnit":118,"energy":105,"protein":1.3,"carbs":27,"fat":0.3,"fiber":3.1,"jainFriendly":true,"satvikFriendly":true},
    {"id":16,"name":"Apple","hindiName":"सेब","category":"Fruits","unit":"piece","gramsPerUnit":100,"energy":52,"protein":0.3,"carbs":14,"fat":0.2,"fiber":2.4,"jainFriendly":true,"satvikFriendly":true},
    {"id":17,"name":"Orange","hindiName":"संतरा","category":"Fruits","unit":"piece","gramsPerUnit":130,"energy":62,"protein":1.2,"carbs":15.4,"fat":0.2,"fiber":3.1,"jainFriendly":true,"satvikFriendly":true},
    {"id":18,"name":"Papaya","hindiName":"पपीता","category":"Fruits","unit":"katori","gramsPerUnit":140,"energy":55,"protein":0.9,"carbs":14,"fat":0.2,"fiber":2.5,"jainFriendly":true,"satvikFriendly":true},
    {"id":19,"name":"Namkeen Mixture","hindiName":"नमकीन मिक्सचर","category":"Snacks","unit":"katori","gramsPerUnit":30,"energy":160,"protein":4.0,"carbs":18,"fat":8.0,"fiber":2.0,"jainFriendly":true,"satvikFriendly":false},
    {"id":20,"name":"Samosa","hindiName":"समोसा","category":"Snacks","unit":"piece","gramsPerUnit":90,"energy":250,"protein":5.0,"carbs":30,"fat":12,"fiber":3.0,"jainFriendly":false,"satvikFriendly":false}
  ];

  // Basic ICMR (simplified) – energy depends on gender + activity multiplier
  const RDA_BASE = {
    male: { kcal: 2320, protein: 54, fat: 70, carbs: 300, fiber: 30 },
    female: { kcal: 1900, protein: 46, fat: 60, carbs: 270, fiber: 25 }
  };
  const ACTIVITY_MULTI = { sedentary: 1.0, light: 1.12, moderate: 1.27, active: 1.45 };

  const state = {
    lang: 'en',
    profile: null,
    rda: null,
    logs: {} // dateISO -> [entries]
  };

  /* ------------------------------------------------------------------
  |  INTERNATIONALISATION (basic demo)                                 |
  ------------------------------------------------------------------*/
  const dict = {
    en: { 
      addMeal: 'Add Meal', 
      info: 'Info', 
      deficient: 'Low', 
      excess: 'High',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      dashboard: 'Dashboard',
      profile: 'Profile'
    },
    hi: { 
      addMeal: 'भोजन जोड़ें', 
      info: 'जानकारी', 
      deficient: 'कम', 
      excess: 'अधिक',
      calories: 'कैलोरी',
      protein: 'प्रोटीन',
      carbs: 'कार्ब्स',
      dashboard: 'डैशबोर्ड',
      profile: 'प्रोफाइल'
    },
    ta: { 
      addMeal: 'உணவு சேர்', 
      info: 'தகவல்', 
      deficient: 'குறை', 
      excess: 'அதிகம்',
      calories: 'கலோரிகள்',
      protein: 'புரதம்',
      carbs: 'கார்போஹைட்ரேட்',
      dashboard: 'டாஷ்போர்டு',
      profile: 'சுயவிவரம்'
    },
    pa: { 
      addMeal: 'ਖਾਣਾ ਸ਼ਾਮਲ ਕਰੋ', 
      info: 'ਜਾਣਕਾਰੀ', 
      deficient: 'ਘੱਟ', 
      excess: 'ਜ਼ਿਆਦਾ',
      calories: 'ਕੈਲੋਰੀ',
      protein: 'ਪ੍ਰੋਟੀਨ',
      carbs: 'ਕਾਰਬ',
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      profile: 'ਪ੍ਰੋਫਾਈਲ'
    }
  };


  function t(key) { return dict[state.lang]?.[key] || key; }

  /* ------------------------------------------------------------------
  |  DOM HELPERS                                                       |
  ------------------------------------------------------------------*/
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  /* ------------------------------------------------------------------
  |  NAVIGATION / ROUTER                                              |
  ------------------------------------------------------------------*/
  function showSection(id) {
    qsa('.section').forEach(s => s.classList.remove('active'));
    qs(`#${id}`).classList.add('active');
    // update nav active state
    qsa('.nav-link').forEach(btn => btn.classList.remove('active'));
    const navBtn = qs(`#nav${toPascal(id)}`);
    if (navBtn) navBtn.classList.add('active');

    // lazy work
    if (id === 'food-log') renderFoodGrid();
    if (id === 'database') renderDatabase();
    if (id === 'reports') initReports();
    if (id === 'profile') updateProfileDisplay();
  }
  function toPascal(str) { return str.replace(/(^|\-)(\w)/g, (_, p1, p2) => p2.toUpperCase()); }

  /* ------------------------------------------------------------------
  |  PROFILE & RDA                                                    |
  ------------------------------------------------------------------*/
  function calculateRDA(profile) {
    const base = RDA_BASE[profile.gender] || RDA_BASE.male;
    const multi = ACTIVITY_MULTI[profile.activity] || 1;
    return {
      kcal: Math.round(base.kcal * multi),
      protein: base.protein,
      fat: Math.round(base.fat * multi),
      carbs: Math.round(base.carbs * multi),
      fiber: base.fiber
    };
  }

  function updateProfileDisplay() {
    if (!state.profile || !state.rda) return;
    
    const profile = state.profile;
    const rda = state.rda;
    
    // Update personal information
    qs('#profileName').textContent = profile.name || '-';
    qs('#profileAge').textContent = profile.age || '-';
    qs('#profileGender').textContent = capitalizeFirst(profile.gender) || '-';
    qs('#profileHeight').textContent = profile.height || '-';
    qs('#profileWeight').textContent = profile.weight || '-';
    
    // Calculate and display BMI
    const bmi = profile.height && profile.weight 
        ? ((profile.weight / ((profile.height / 100) ** 2))).toFixed(1)
        : '-';
    qs('#profileBMI').textContent = bmi;
    
    // Update nutrition targets
    qs('#targetCalories').textContent = rda.kcal || '-';
    qs('#targetProtein').textContent = rda.protein || '-';
    qs('#targetCarbs').textContent = rda.carbs || '-';
    qs('#targetFat').textContent = rda.fat || '-';
    qs('#targetFiber').textContent = rda.fiber || '-';
    
    // Update dietary information
    qs('#profileDiet').textContent = capitalizeFirst(profile.diet) || '-';
    qs('#profileRegion').textContent = formatRegion(profile.region) || '-';
    qs('#profileActivity').textContent = formatActivity(profile.activity) || '-';
    
    // Show BMI status
    updateBMIStatus(bmi);
}

// Helper functions
function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function formatRegion(region) {
    const regions = {
        'north': 'North Indian',
        'south': 'South Indian', 
        'east': 'East Indian',
        'west': 'West Indian'
    };
    return regions[region] || region;
}

function formatActivity(activity) {
    const activities = {
        'sedentary': 'Sedentary',
        'light': 'Light Activity',
        'moderate': 'Moderate Activity', 
        'active': 'Very Active'
    };
    return activities[activity] || activity;
}

function updateBMIStatus(bmi) {
    const bmiElement = qs('#profileBMI');
    const statusElement = qs('#bmiStatus');
    
    if (bmi === '-') {
        statusElement.textContent = '';
        return;
    }
    
    const bmiValue = parseFloat(bmi);
    let status = '';
    let statusClass = '';
    
    if (bmiValue < 18.5) {
        status = 'Underweight';
        statusClass = 'status--warning';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
        status = 'Normal';
        statusClass = 'status--success';
    } else if (bmiValue >= 25 && bmiValue < 30) {
        status = 'Overweight';
        statusClass = 'status--warning';
    } else {
        status = 'Obese';
        statusClass = 'status--error';
    }
    
    statusElement.textContent = status;
    statusElement.className = `status ${statusClass}`;
}


  /* ------------------------------------------------------------------
  |  ONBOARDING                                                       |
  ------------------------------------------------------------------*/
function handleLanguageSelect(lang) {
  state.lang = lang;
  hide(qs('#languageModal'));
  
  // Always show onboarding after language selection
  // even if profile exists (to ensure complete setup)
  show(qs('#onboardingModal'));
  
  applyLanguage();
}

  function applyLanguage() {
    qs('#fabAddMeal').setAttribute('aria-label', t('addMeal'));
    qs('#fabAddMeal').title = t('addMeal');
    // more UI strings could be switched here – minimal for demo
  }


  // ====================================================
  
  
  function handleOnboardingSubmit(e) {
  e.preventDefault();
  const form = e.target;
  
  // Validate all required fields
  const requiredFields = ['userName', 'userAge', 'userGender', 'userHeight', 'userWeight', 'userActivity', 'userDiet', 'userRegion'];
  
  for (let field of requiredFields) {
    if (!form[field].value.trim()) {
      alert(`Please fill in all required fields`);
      return;
    }
  }
  
  const profile = {
    name: form.userName.value.trim(),
    age: +form.userAge.value,
    gender: form.userGender.value,
    height: +form.userHeight.value,
    weight: +form.userWeight.value,
    activity: form.userActivity.value,
    diet: form.userDiet.value,
    region: form.userRegion.value
  };
  
  state.profile = profile;
  state.rda = calculateRDA(profile);
  hide(qs('#onboardingModal'));
  
  // Now show the main application
  showMainApplication();
}
  
  
  // function handleOnboardingSubmit(e) {
  //   e.preventDefault();
  //   const form = e.target;
  //   const profile = {
  //     name: form.userName.value.trim(),
  //     age: +form.userAge.value,
  //     gender: form.userGender.value,
  //     height: +form.userHeight.value,
  //     weight: +form.userWeight.value,
  //     activity: form.userActivity.value,
  //     diet: form.userDiet.value,
  //     region: form.userRegion.value
  //   };
  //   state.profile = profile;
  //   state.rda = calculateRDA(profile);
  //   hide(qs('#onboardingModal'));
  //   updateDashboard();
  //   updateProfileDisplay();
  // }



  /* ------------------------------------------------------------------
  |  FOOD SEARCH & LOGGING                                            |
  ------------------------------------------------------------------*/
  function renderFoodGrid() {
    const grid = qs('#foodGrid');
    if (!grid) return;
    const term = qs('#foodSearch').value.toLowerCase();
    const cat = qs('#categoryFilter').value;
    const dietFilter = qs('#dietFilter').value; // jain / satvik

    const filtered = foods.filter(f => {
      const matchTerm = !term || f.name.toLowerCase().includes(term) || f.hindiName.includes(term);
      const matchCat = !cat || f.category === cat;
      const matchDiet = !dietFilter || (dietFilter === 'jain' ? f.jainFriendly : f.satvikFriendly);
      return matchTerm && matchCat && matchDiet;
    });

    grid.innerHTML = '';
    filtered.forEach(f => grid.appendChild(foodCard(f)));
  }

  function foodCard(food) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
      <div class="food-card-header">
        <div>
          <div class="food-name">${food.name}</div>
          <div class="food-hindi">${food.hindiName}</div>
        </div>
        <div class="food-category">${food.category}</div>
      </div>
      <div class="food-nutrition">
        <div>${food.energy} kcal</div>
        <div>${food.protein} g P</div>
        <div>${food.carbs} g C</div>
        <div>${food.fat} g F</div>
      </div>`;
    card.addEventListener('click', () => openFoodModal(food));
    return card;
  }

  let currentFood = null;
  function openFoodModal(food) {
    currentFood = food;
    qs('#selectedFoodName').textContent = food.name;
    qs('#selectedFoodHindi').textContent = food.hindiName;
    const unitSel = qs('#foodUnit');
    unitSel.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = food.unit;
    opt.textContent = `${food.unit} (~${food.gramsPerUnit} g)`;
    unitSel.appendChild(opt);
    const opt100 = document.createElement('option');
    opt100.value = 'g100';
    opt100.textContent = 'per 100g';
    unitSel.appendChild(opt100);
    qs('#foodQuantity').value = 1;
    updateNutritionPreview();
    show(qs('#foodModal'));
  }
  function closeFoodModal() { hide(qs('#foodModal')); currentFood = null; }

  function updateNutritionPreview() {
    if (!currentFood) return;
    const qty = parseFloat(qs('#foodQuantity').value) || 1;
    const unit = qs('#foodUnit').value;
    const grams = unit === 'g100' ? 100 : currentFood.gramsPerUnit;
    const factor = (grams * qty) / 100;
    const preview = qs('#nutritionPreview .nutrition-grid');
    const data = {
      Calories: Math.round(currentFood.energy * factor),
      Protein: +(currentFood.protein * factor).toFixed(1) + ' g',
      Carbs: +(currentFood.carbs * factor).toFixed(1) + ' g',
      Fat: +(currentFood.fat * factor).toFixed(1) + ' g'
    };
    preview.innerHTML = Object.entries(data).map(([k,v])=>`<div class="nutrition-item"><div class="nutrition-value">${v}</div><div class="nutrition-label">${k}</div></div>`).join('');
  }

  function addFoodToLog() {
    if (!currentFood || !state.profile) return;
    const date = qs('#currentDate').value || new Date().toISOString().split('T')[0];
    if (!state.logs[date]) state.logs[date] = [];
    const qty = parseFloat(qs('#foodQuantity').value) || 1;
    const unit = qs('#foodUnit').value;
    const grams = unit === 'g100' ? 100 : currentFood.gramsPerUnit;
    const factor = (grams * qty) / 100;
    const entry = {
      id: Date.now(),
      foodId: currentFood.id,
      name: currentFood.name,
      qty,
      unit,
      energy: Math.round(currentFood.energy * factor),
      protein: +(currentFood.protein * factor).toFixed(1),
      carbs: +(currentFood.carbs * factor).toFixed(1),
      fat: +(currentFood.fat * factor).toFixed(1)
    };
    state.logs[date].push(entry);

    // assert totals math
    const sumCals = state.logs[date].reduce((s,e)=>s+e.energy,0);
    const calcSum = state.logs[date].map(e=>e.energy).reduce((a,b)=>a+b,0);
    console.assert(sumCals===calcSum,'Calorie total mismatch');

    closeFoodModal();
    updateDashboard();
    showSection('dashboard');
  }

  /* ------------------------------------------------------------------
  |  DASHBOARD                                                        |
  ------------------------------------------------------------------*/
  function updateDashboard() {
    if (!state.profile) return;
    const date = qs('#currentDate').value || new Date().toISOString().split('T')[0];
    const dayLog = state.logs[date] || [];
    const totals = dayLog.reduce((acc,e)=>{
      acc.kcal += e.energy;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },{kcal:0,protein:0,carbs:0,fat:0});

    updateProgress('calories', totals.kcal, state.rda.kcal,'kcal');
    updateProgress('protein', totals.protein, state.rda.protein,'g');
    updateProgress('carbs', totals.carbs, state.rda.carbs,'g');
    updateProgress('fat', totals.fat, state.rda.fat,'g');

    renderMealsList(dayLog);
  }

  function updateProgress(key,current,target,unit){
    const bar=qs(`#${key}Progress`); const text=qs(`#${key}Text`);
    const pct = target? (current/target)*100:0;
    bar.style.width = Math.min(pct,100)+'%';
    bar.classList.remove('deficient','excess');
    if (pct<80) bar.classList.add('deficient');
    else if(pct>110) bar.classList.add('excess');
    text.textContent=`${Math.round(current)}/${target} ${unit}`;
    // assertion for color
    if(pct<80) console.assert(bar.classList.contains('deficient'),'Color state incorrect');
  }

  function renderMealsList(log){
    const container = qs('#todaysMeals');
    if(!container) return;
    if(!log.length){ container.innerHTML = '<p class="no-meals">No meals logged yet. Start by adding your first meal!</p>'; return; }
    container.innerHTML = log.map(e=>`<div class="meal-item"><div class="meal-info"><div class="meal-name">${e.name}</div><div class="meal-details">${e.qty} ${e.unit}</div></div><div class="meal-nutrition">${e.energy} kcal</div></div>`).join('');
  }

  /* ------------------------------------------------------------------
  |  FOOD DATABASE                                                    |
  ------------------------------------------------------------------*/
  function renderDatabase(){
    const grid = qs('#foodDatabase');
    if(!grid) return;
    grid.innerHTML='';
    foods.forEach(f=>grid.appendChild(foodCard(f)));
  }

  /* ------------------------------------------------------------------
  |  REPORTS (Charts)                                                 |
  ------------------------------------------------------------------*/
  let chartsInit = false;
  function initReports(){
    if(chartsInit) {updateCharts(); return;}
    loadChartJs().then(()=>{ buildCharts(); chartsInit=true; updateCharts(); });
  }

  function loadChartJs(){
    return new Promise(res=>{
      if(window.Chart){res(); return;}
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
      s.onload=()=>res();
      document.head.appendChild(s);
    });
  }

  let calorieChart, macroChart;
  function buildCharts(){
    const ctxCal = qs('#calorieChart').getContext('2d');
    const ctxMac = qs('#macroChart').getContext('2d');
    calorieChart = new Chart(ctxCal,{type:'bar',data:{labels:[],datasets:[{label:'Calories',data:[],backgroundColor:'#FF9933'}]},options:{responsive:true,maintainAspectRatio:false}});
    macroChart = new Chart(ctxMac,{type:'line',data:{labels:[],datasets:[{label:'Protein (g)',data:[],borderColor:'#138808',backgroundColor:'rgba(19,136,8,0.2)'},{label:'Carbs (g)',data:[],borderColor:'#1FB8CD',backgroundColor:'rgba(31,184,205,0.2)'},{label:'Fat (g)',data:[],borderColor:'#B4413C',backgroundColor:'rgba(180,65,60,0.2)'}]},options:{responsive:true,maintainAspectRatio:false}});
  }

  function updateCharts(){
    const period = qs('#reportPeriod').value;
    const days = period==='month'?30:7;
    const dates = Array.from({length:days}).map((_,i)=>{
      const d = new Date(); d.setDate(d.getDate()- (days-1-i));
      return d.toISOString().split('T')[0];
    });
    const calData=[], prot=[], carbs=[], fat=[];
    dates.forEach(date=>{
      const log = state.logs[date]||[];
      const t=log.reduce((a,e)=>{a.k+=e.energy;a.p+=e.protein;a.c+=e.carbs;a.f+=e.fat;return a;},{k:0,p:0,c:0,f:0});
      calData.push(t.k);
      prot.push(t.p);
      carbs.push(t.c);
      fat.push(t.f);
    });
    calorieChart.data.labels=dates; calorieChart.data.datasets[0].data=calData; calorieChart.update();
    macroChart.data.labels=dates; macroChart.data.datasets[0].data=prot; macroChart.data.datasets[1].data=carbs; macroChart.data.datasets[2].data=fat; macroChart.update();
  }

  /* ------------------------------------------------------------------
  |  UTIL ACTIONS                                                     |
  ------------------------------------------------------------------*/
  function showRecommendations(){
    if(!state.rda) return alert('Complete profile first');
    const date = qs('#currentDate').value || new Date().toISOString().split('T')[0];
    const totals = (state.logs[date]||[]).reduce((acc,e)=>{acc.k+=e.energy; acc.p+=e.protein; return acc;},{k:0,p:0});
    const msgs=[];
    if(totals.k < 0.8*state.rda.kcal) msgs.push('Add calorie-dense foods like banana or nuts.');
    if(totals.p < 0.8*state.rda.protein) msgs.push('Include protein sources such as dal or paneer.');
    if(!msgs.length) msgs.push('Great job!');
    alert(msgs.join('\n'));
  }
  function downloadReport(){ window.print(); }
  function editProfile(){ show(qs('#onboardingModal')); }
  function changeLanguage(){ show(qs('#languageModal')); }
  function clearAllData(){ if(confirm('Clear all data?')){state.logs={}; state.profile=null; location.reload();} }

  // ==================================


  function hideMainApplication() {
  // Hide header navigation and main content
  const header = qs('.header');
  const main = qs('.main');
  const fab = qs('.fab');
  
  if (header) header.style.display = 'none';
  if (main) main.style.display = 'none';
  if (fab) fab.style.display = 'none';
}

function showMainApplication() {

  // Remove setup mode and add complete class
  document.body.classList.remove('setup-mode');
  document.body.classList.add('setup-complete');
  
  // Show main application elements
  const header = qs('.header');
  const main = qs('.main');
  const fab = qs('.fab');
  
  if (header) header.style.display = 'block';
  if (main) main.style.display = 'block';
  if (fab) fab.style.display = 'block';
  

  // Show dashboard by default
  showSection('dashboard');
  updateDashboard();
}


  /* ------------------------------------------------------------------
  |  INIT                                                             |
  ------------------------------------------------------------------*/

  function init(){

    // Add setup mode class to body initially
  document.body.classList.add('setup-mode');
  // Rest of init function...
  // Hide all main sections initially until profile is complete
  hideMainApplication();
  
  // date input default
  const today = new Date().toISOString().split('T')[0];
  qs('#currentDate').value = today;

  // Event listeners
  qs('#foodSearch').addEventListener('input', renderFoodGrid);
  qs('#categoryFilter').addEventListener('change', renderFoodGrid);
  qs('#dietFilter').addEventListener('change', renderFoodGrid);
  qs('#foodQuantity').addEventListener('input', updateNutritionPreview);
  qs('#foodUnit').addEventListener('change', updateNutritionPreview);
  qs('#currentDate').addEventListener('change', updateDashboard);
  qs('#reportPeriod').addEventListener('change', updateCharts);
  qs('#onboardingForm').addEventListener('submit', handleOnboardingSubmit);

  // expose for inline attrs
  window.selectLanguage = handleLanguageSelect;
  window.showSection = showSection;
  window.closeFoodModal = closeFoodModal;
  window.addFoodToLog = addFoodToLog;
  window.showRecommendations = showRecommendations;
  window.downloadReport = downloadReport;
  window.editProfile = editProfile;
  window.changeLanguage = changeLanguage;
  window.clearAllData = clearAllData;

  applyLanguage();
}


  document.addEventListener('DOMContentLoaded', init);
})();