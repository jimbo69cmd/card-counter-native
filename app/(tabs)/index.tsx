import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform, // You'll need this for platform-specific ad unit IDs
  Alert
} from 'react-native';

// --- REMOVE THIS LINE: import { AdMobBanner, AdMobInterstitial, setTestDeviceIDAsync, TestIds } from 'expo-ads-admob'; ---
// --- ADD THESE NEW IMPORTS: ---
import mobileAds, { BannerAd, BannerAdSize, InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
// ------------------------------------

interface BlackjackCounterProps {}

// Ad Unit IDs - Now correctly using TestIds from react-native-google-mobile-ads
const adUnitIds = {
  // Use TestIds for development, your real IDs for production
  // It's good practice to define platform-specific IDs if they differ
  bannerAndroid: __DEV__ ? TestIds.BANNER : 'ca-app-pub-7038105706744077/7180078839',
  bannerIOS: __DEV__ ? TestIds.BANNER : 'YOUR_IOS_BANNER_AD_UNIT_ID', // Replace with your actual iOS banner ID
  interstitialAndroid: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7038105706744077/9848003572',
  interstitialIOS: __DEV__ ? TestIds.INTERSTITIAL : 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID' // Replace with your actual iOS interstitial ID
};

const BlackjackCounter: React.FC<BlackjackCounterProps> = () => {
  const [runningCount, setRunningCount] = useState(0);
  const [cardsDealt, setCardsDealt] = useState(0);
  const [shoeSize, setShoeSize] = useState(6);
  const [minBet, setMinBet] = useState(10);
  const [shoeSizeInput, setShoeSizeInput] = useState('6');
  const [minBetInput, setMinBetInput] = useState('10');
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [splitHand, setSplitHand] = useState<string[]>([]);
  const [isSplit, setIsSplit] = useState(false);
  const [activeHand, setActiveHand] = useState<'main' | 'split'>('main');
  const [dealerUpCard, setDealerUpCard] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [splitRecommendation, setSplitRecommendation] = useState('');
  const [betAmount, setBetAmount] = useState(10);
  const [cardHistory, setCardHistory] = useState<string[]>([]);
  const [lastCard, setLastCard] = useState('');
  
 // Ad related states
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [interstitialAdInstance, setInterstitialAdInstance] = useState<InterstitialAd | null>(null); // To store the ad instance
  // No need for bannerError state if you handle failed loads on the BannerAd component itself

  // Hi-Lo card values
  const hiLoValues: { [key: string]: number } = {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
  };

// Inside your BlackjackCounter component
// ... (your existing state and other functions) ...

// Ad Unit IDs (ensure these are correctly defined at the top of your file)
const adUnitIds = {
  // Banner Ad Units
  bannerAndroid: __DEV__ ? TestIds.BANNER : 'ca-app-pub-7038105706744077/7180078839', // Your real Android banner ID
  bannerIOS: __DEV__ ? TestIds.BANNER : 'YOUR_IOS_BANNER_AD_UNIT_ID', // Replace with your actual iOS banner ID

  // Interstitial Ad Units
  interstitialAndroid: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7038105706744077/9848003572', // Your real Android interstitial ID
  interstitialIOS: __DEV__ ? TestIds.INTERSTITIAL : 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID' // Replace with your actual iOS interstitial ID
};

// ... (your other state and functions) ...

// Initialize interstitial ad for react-native-google-mobile-ads
useEffect(() => {
  // Determine which ad unit ID to use based on the platform
  const currentInterstitialAdUnitId = Platform.select({
    ios: adUnitIds.interstitialIOS,
    android: adUnitIds.interstitialAndroid,
    default: TestIds.INTERSTITIAL, // Fallback for unsupported platforms/testing
  });

  // Create the ad instance
  const interstitial = InterstitialAd.createForAdRequest(currentInterstitialAdUnitId, {
  });

  // Store the ad instance in state so it can be shown later
  setInterstitialAdInstance(interstitial);

  // Set up event listeners for the ad lifecycle
  const unsubscribeLoaded = interstitial.addAdEventListener(
    AdEventType.LOADED,
    () => {
      setInterstitialLoaded(true);
      console.log('Interstitial Ad loaded!');
    }
  );

  const unsubscribeClosed = interstitial.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      setInterstitialLoaded(false); // Reset loaded state
      console.log('Interstitial Ad closed!');
      // After the ad is closed, immediately load another one for the next time it's needed
      interstitial.load();
    }
  );

  const unsubscribeError = interstitial.addAdEventListener(
    AdEventType.ERROR,
    (error) => {
      console.error('Interstitial ad failed to load:', error);
      setInterstitialLoaded(false);
    }
  );

  // Request the ad to load when this effect runs
  interstitial.load();

  // Cleanup: Remove event listeners when the component unmounts or dependencies change
  return () => {
    unsubscribeLoaded();
    unsubscribeClosed();
    unsubscribeError();
  };
}, [adUnitIds.interstitialAndroid, adUnitIds.interstitialIOS]); // Re-run if ad unit IDs change

// Calculate true count
const getTrueCount = (): number => {
  const decksRemaining = shoeSize - (cardsDealt / 52);
  return decksRemaining > 0 ? Math.round(runningCount / decksRemaining) : 0;
};

// Calculate suggested bet
const calculateBet = (): number => {
  const trueCount = getTrueCount();
  if (trueCount <= 1) return minBet;
  return minBet * Math.min(trueCount, 8); // Cap at 8x min bet
};

// Update bet amount when count changes
useEffect(() => {
  setBetAmount(calculateBet());
}, [runningCount, cardsDealt, shoeSize, minBet]);

// Add card to count
const addCard = (card: string): void => {
  const value = hiLoValues[card] || 0;
  setRunningCount(prev => prev + value);
  setCardsDealt(prev => prev + 1);
  setCardHistory(prev => [...prev, card]);
  setLastCard(card);
};

// Undo last card
const undoLastCard = (): void => {
  if (cardHistory.length === 0) return;
  
  const lastCardAdded = cardHistory[cardHistory.length - 1];
  const value = hiLoValues[lastCardAdded] || 0;
  
  setRunningCount(prev => prev - value);
  setCardsDealt(prev => prev - 1);
  setCardHistory(prev => prev.slice(0, -1));
  setLastCard(cardHistory.length > 1 ? cardHistory[cardHistory.length - 2] : '');
};

// Calculate hand value
const calculateHandValue = (cards: string[]): number => {
  let value = 0;
  let aces = 0;
  
  for (let card of cards) {
    if (card === 'A') {
      aces++;
      value += 11;
    } else if (['J', 'Q', 'K'].includes(card)) {
      value += 10;
    } else {
      value += parseInt(card);
    }
  }
  
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
};

  // Basic strategy logic
  const getBasicStrategy = (cards: string[]): string => {
    if (cards.length === 0 || !dealerUpCard) return '';

    const playerValue = calculateHandValue(cards);
    const dealerValue = dealerUpCard === 'A' ? 11 : 
                       ['J', 'Q', 'K'].includes(dealerUpCard) ? 10 : 
                       parseInt(dealerUpCard);

    // Check for pairs (split option) - only for initial two cards
    if (cards.length === 2 && cards[0] === cards[1] && !isSplit) {
      const pair = cards[0];
      
      // Always split
      if (['A', '8'].includes(pair)) return 'SPLIT';
      
      // Never split
      if (['5', '10', 'J', 'Q', 'K'].includes(pair)) {
        // Continue with regular strategy
      } else {
        // Conditional splits
        if (pair === '2' || pair === '3') {
          return dealerValue <= 7 ? 'SPLIT' : 'HIT';
        }
        if (pair === '4') return 'HIT';
        if (pair === '6') return dealerValue <= 6 ? 'SPLIT' : 'HIT';
        if (pair === '7') return dealerValue <= 7 ? 'SPLIT' : 'HIT';
        if (pair === '9') {
          return (dealerValue <= 6 || dealerValue === 8 || dealerValue === 9) ? 'SPLIT' : 'STAND';
        }
      }
    }

    // Soft hands (with Ace)
    const hasAce = cards.includes('A');
    if (hasAce && playerValue <= 21) {
      if (playerValue >= 19) return 'STAND';
      if (playerValue === 18) return dealerValue <= 6 ? 'DOUBLE/STAND' : dealerValue <= 8 ? 'STAND' : 'HIT';
      if (playerValue === 17) return dealerValue <= 6 ? 'DOUBLE/HIT' : 'HIT';
      if (playerValue >= 15) return dealerValue <= 6 ? 'DOUBLE/HIT' : 'HIT';
      if (playerValue >= 13) return dealerValue <= 6 ? 'DOUBLE/HIT' : 'HIT';
    }

    // Hard hands
    if (playerValue >= 17) return 'STAND';
    if (playerValue >= 13) return dealerValue <= 6 ? 'STAND' : 'HIT';
    if (playerValue === 12) return (dealerValue >= 4 && dealerValue <= 6) ? 'STAND' : 'HIT';
    if (playerValue === 11) return 'DOUBLE/HIT';
    if (playerValue === 10) return dealerValue <= 9 ? 'DOUBLE/HIT' : 'HIT';
    if (playerValue === 9) return (dealerValue >= 3 && dealerValue <= 6) ? 'DOUBLE/HIT' : 'HIT';
    
    return 'HIT';
  };

  // Update recommendation when cards change
  useEffect(() => {
    setRecommendation(getBasicStrategy(playerCards));
    if (isSplit) {
      setSplitRecommendation(getBasicStrategy(splitHand));
    }
  }, [playerCards, splitHand, dealerUpCard, isSplit]);

  // Handle shoe size input
  const handleShoeSizeChange = (text: string): void => {
    setShoeSizeInput(text);
  };

  const handleShoeSizeBlur = (): void => {
    const value = parseInt(shoeSizeInput);
    if (isNaN(value) || value <= 0) {
      setShoeSizeInput('6');
      setShoeSize(6);
    } else {
      setShoeSize(value);
    }
  };

  // Handle min bet input
  const handleMinBetChange = (text: string): void => {
    setMinBetInput(text);
  };

  const handleMinBetBlur = (): void => {
    const value = parseInt(minBetInput);
    if (isNaN(value) || value <= 0) {
      setMinBetInput('10');
      setMinBet(10);
    } else {
      setMinBet(value);
    }
  };

  // Reset functions - Modified to show interstitial ad
  const resetCount = async (): Promise<void> => {
    // Show interstitial ad if loaded
    if (interstitialLoaded && interstitialAdInstance) {
      try {
        await interstitialAdInstance.show(); // Use the stored instance
      } catch (error) {
        console.log('Error showing interstitial ad:', error);
      }
    } else {
      console.log('Interstitial ad not loaded, skipping show.');
    }
  
  // Reset the count regardless of ad status
  setRunningCount(0);
  setCardsDealt(0);
  setBetAmount(minBet);
  setCardHistory([]);
  setLastCard('');
};

  const resetHand = (): void => {
    setPlayerCards([]);
    setSplitHand([]);
    setIsSplit(false);
    setActiveHand('main');
    setDealerUpCard('');
    setRecommendation('');
    setSplitRecommendation('');
  };

  const addPlayerCard = (card: string): void => {
    // Add to count when adding player cards
    addCard(card);
    
    if (activeHand === 'main') {
      setPlayerCards(prev => [...prev, card]);
    } else {
      setSplitHand(prev => [...prev, card]);
    }
  };

  const removePlayerCard = (index: number): void => {
    let removedCard = '';
    if (activeHand === 'main') {
      removedCard = playerCards[index];
      setPlayerCards(prev => prev.filter((_, i) => i !== index));
    } else {
      removedCard = splitHand[index];
      setSplitHand(prev => prev.filter((_, i) => i !== index));
    }
    
    // Remove from count when removing player cards
    const value = hiLoValues[removedCard] || 0;
    setRunningCount(prev => prev - value);
    setCardsDealt(prev => prev - 1);
    
    // Remove from history if it's the last card
    if (cardHistory[cardHistory.length - 1] === removedCard) {
      setCardHistory(prev => prev.slice(0, -1));
      setLastCard(cardHistory.length > 1 ? cardHistory[cardHistory.length - 2] : '');
    }
  };

  const setDealerCard = (card: string): void => {
    // If there was a previous dealer card, remove it from count
    if (dealerUpCard) {
      const prevValue = hiLoValues[dealerUpCard] || 0;
      setRunningCount(prev => prev - prevValue);
      setCardsDealt(prev => prev - 1);
      
      // Remove from history
      const historyIndex = cardHistory.lastIndexOf(dealerUpCard);
      if (historyIndex !== -1) {
        setCardHistory(prev => prev.filter((_, i) => i !== historyIndex));
      }
    }
    
    // Add new dealer card to count
    addCard(card);
    setDealerUpCard(card);
  };

  const executeSplit = (): void => {
    if (playerCards.length === 2 && playerCards[0] === playerCards[1]) {
      const card = playerCards[0];
      setPlayerCards([card]);
      setSplitHand([card]);
      setIsSplit(true);
      setActiveHand('main');
    }
  };

  const cardButtons = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const getCardButtonStyle = (card: string) => {
    const value = hiLoValues[card];
    if (value === 1) return styles.positiveCard;
    if (value === -1) return styles.negativeCard;
    return styles.neutralCard;
  };

  const getRecommendationStyle = () => {
    if (recommendation.includes('HIT')) return styles.hitRecommendation;
    if (recommendation.includes('STAND')) return styles.standRecommendation;
    if (recommendation.includes('SPLIT')) return styles.splitRecommendation;
    if (recommendation.includes('DOUBLE')) return styles.doubleRecommendation;
    return styles.defaultRecommendation;
  };

  const requestOptions = {
  servePersonalizedAds: false,
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Blackjack Card Counter</Text>
          <Text style={styles.subtitle}>Hi-Lo System with Basic Strategy</Text>
        </View>

        {/* Count Display */}
        <View style={styles.countContainer}>
          <View style={styles.countRow}>
            <View style={styles.countItem}>
              <Text style={styles.countValue}>{runningCount}</Text>
              <Text style={styles.countLabel}>Running Count</Text>
            </View>
            <View style={styles.countItem}>
              <Text style={styles.trueCountValue}>{getTrueCount()}</Text>
              <Text style={styles.countLabel}>True Count</Text>
            </View>
          </View>
          <View style={styles.countRow}>
            <View style={styles.countItem}>
              <Text style={styles.betValue}>${betAmount}</Text>
              <Text style={styles.countLabel}>Suggested Bet</Text>
            </View>
            <View style={styles.countItem}>
              <Text style={styles.cardsValue}>{cardsDealt}</Text>
              <Text style={styles.countLabel}>Cards Dealt</Text>
            </View>
          </View>
        </View>

        {/* Card Input */}
        <View style={styles.cardInputContainer}>
          <Text style={styles.sectionTitle}>Add Visible Cards to Count</Text>
          <View style={styles.cardGrid}>
            {cardButtons.map(card => (
              <TouchableOpacity
                key={card}
                style={[styles.cardButton, getCardButtonStyle(card)]}
                onPress={() => addCard(card)}
              >
                <Text style={styles.cardButtonText}>{card}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.cardLegend}>
            <Text style={styles.legendText}>
              <Text style={styles.positiveText}>Green: +1</Text> | 
              <Text style={styles.neutralText}> Gray: 0</Text> | 
              <Text style={styles.negativeText}> Red: -1</Text>
            </Text>
          </View>
          
          {/* Last Card and Undo */}
          <View style={styles.undoContainer}>
            <View style={styles.lastCardContainer}>
              <Text style={styles.lastCardLabel}>Last Card:</Text>
              <Text style={styles.lastCardValue}>{lastCard || 'None'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.undoButton, cardHistory.length === 0 && styles.disabledButton]} 
              onPress={undoLastCard}
              disabled={cardHistory.length === 0}
            >
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hand Analysis */}
        <View style={styles.handAnalysisContainer}>
          <Text style={styles.sectionTitle}>Hand Analysis & Strategy</Text>
          
          <View style={styles.handSection}>
            <View style={styles.handHeader}>
              <Text style={styles.handTitle}>Your Cards</Text>
              {isSplit && (
                <View style={styles.handToggle}>
                  <TouchableOpacity
                    style={[styles.handToggleButton, activeHand === 'main' && styles.activeHandButton]}
                    onPress={() => setActiveHand('main')}
                  >
                    <Text style={styles.handToggleText}>Hand 1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.handToggleButton, activeHand === 'split' && styles.activeHandButton]}
                    onPress={() => setActiveHand('split')}
                  >
                    <Text style={styles.handToggleText}>Hand 2</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.cardGrid}>
              {cardButtons.map(card => (
                <TouchableOpacity
                  key={card}
                  style={styles.playerCardButton}
                  onPress={() => addPlayerCard(card)}
                >
                  <Text style={styles.cardButtonText}>{card}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {!isSplit ? (
              <View>
                <View style={styles.playerCardsDisplay}>
                  {playerCards.map((card, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.playerCard}
                      onPress={() => removePlayerCard(index)}
                    >
                      <Text style={styles.playerCardText}>{card}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {playerCards.length > 0 && (
                  <Text style={styles.handValue}>
                    Hand Value: {calculateHandValue(playerCards)}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.splitHandsContainer}>
                <View style={styles.splitHandColumn}>
                  <Text style={styles.splitHandTitle}>Hand 1 {activeHand === 'main' ? '(Active)' : ''}</Text>
                  <View style={styles.playerCardsDisplay}>
                    {playerCards.map((card, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.playerCard, activeHand === 'main' && styles.activeHandCard]}
                        onPress={() => {
                          setActiveHand('main');
                          removePlayerCard(index);
                        }}
                      >
                        <Text style={styles.playerCardText}>{card}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {playerCards.length > 0 && (
                    <Text style={styles.handValue}>
                      Value: {calculateHandValue(playerCards)}
                    </Text>
                  )}
                </View>
                
                <View style={styles.splitHandColumn}>
                  <Text style={styles.splitHandTitle}>Hand 2 {activeHand === 'split' ? '(Active)' : ''}</Text>
                  <View style={styles.playerCardsDisplay}>
                    {splitHand.map((card, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.playerCard, activeHand === 'split' && styles.activeHandCard]}
                        onPress={() => {
                          setActiveHand('split');
                          removePlayerCard(index);
                        }}
                      >
                        <Text style={styles.playerCardText}>{card}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {splitHand.length > 0 && (
                    <Text style={styles.handValue}>
                      Value: {calculateHandValue(splitHand)}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          <View style={styles.handSection}>
            <Text style={styles.handTitle}>Dealer Up Card</Text>
            <View style={styles.cardGrid}>
              {cardButtons.map(card => (
                <TouchableOpacity
                  key={card}
                  style={[
                    styles.dealerCardButton,
                    dealerUpCard === card && styles.selectedDealerCard
                  ]}
                  onPress={() => setDealerCard(card)}
                >
                  <Text style={styles.cardButtonText}>{card}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {dealerUpCard && (
              <Text style={styles.dealerValue}>
                Dealer Shows: {dealerUpCard}
              </Text>
            )}
            
            {recommendation && (
              <View style={[styles.recommendationBox, getRecommendationStyle()]}>
                <Text style={styles.recommendationText}>{recommendation}</Text>
                {recommendation === 'SPLIT' && (
                  <TouchableOpacity style={styles.splitButton} onPress={executeSplit}>
                    <Text style={styles.splitButtonText}>Execute Split</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {isSplit && (
              <View style={styles.splitRecommendations}>
                <View style={styles.splitRecommendationItem}>
                  <Text style={styles.splitRecommendationLabel}>Hand 1:</Text>
                  <View style={[styles.miniRecommendationBox, getRecommendationStyle()]}>
                    <Text style={styles.miniRecommendationText}>{recommendation}</Text>
                  </View>
                </View>
                <View style={styles.splitRecommendationItem}>
                  <Text style={styles.splitRecommendationLabel}>Hand 2:</Text>
                  <View style={[styles.miniRecommendationBox, getRecommendationStyle()]}>
                    <Text style={styles.miniRecommendationText}>{splitRecommendation}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          
          <TouchableOpacity style={styles.newHandButton} onPress={resetHand}>
            <Text style={styles.newHandButtonText}>New Hand</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Shoe Size (Decks)</Text>
            <TextInput
              style={styles.input}
              value={shoeSizeInput}
              onChangeText={handleShoeSizeChange}
              onBlur={handleShoeSizeBlur}
              keyboardType="numeric"
              placeholder="6"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Minimum Bet ($)</Text>
            <TextInput
              style={styles.input}
              value={minBetInput}
              onChangeText={handleMinBetChange}
              onBlur={handleMinBetBlur}
              keyboardType="numeric"
              placeholder="10"
            />
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetCount}>
            <Text style={styles.resetButtonText}>Reset Count</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This app is intended for educational and entertainment purposes only. It is not a gambling tool and should not be used in live casino environments.
          </Text>
          <Text style={styles.disclaimerText}>
            The developer assumes no responsibility for actions taken based on the use of this app, including being asked to leave or banned from casinos.
          </Text>
          <Text style={styles.disclaimerText}>
            Users are solely responsible for complying with local laws and casino policies. Use at your own risk.
          </Text>
        </View>

        {/* Add some bottom padding to account for the banner ad */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Banner Ad */}
        <View style={styles.bannerContainer}>
        <BannerAd
          unitId={Platform.select({
            ios: adUnitIds.bannerIOS,
            android: adUnitIds.bannerAndroid,
            default: TestIds.BANNER, // Fallback for unsupported platforms/testing
          })}
          size={BannerAdSize.BANNER}
          requestOptions={{
            // No 'requestNonPersonalizedAdsOnly' here. Configure globally if needed.
          }}
          onAdLoaded={() => {
            console.log('Banner ad loaded');
          }}
          onAdFailedToLoad={(error) => {
            console.error('Banner ad failed to load:', error);
            // You can set a state here to show a placeholder if needed
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#16423c',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#86efac',
  },
  countContainer: {
    backgroundColor: '#1f2937',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  countItem: {
    alignItems: 'center',
  },
  countValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  trueCountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  betValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34d399',
  },
  cardsValue: {
    fontSize: 18,
    color: '#d1d5db',
  },
  countLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  settingsContainer: {
    backgroundColor: '#1f2937',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34d399',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 4,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardInputContainer: {
    backgroundColor: '#1f2937',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8,
  },
  positiveCard: {
    backgroundColor: '#16a34a',
  },
  neutralCard: {
    backgroundColor: '#4b5563',
  },
  negativeCard: {
    backgroundColor: '#dc2626',
  },
  cardButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardLegend: {
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  positiveText: {
    color: '#34d399',
  },
  neutralText: {
    color: '#9ca3af',
  },
  negativeText: {
    color: '#f87171',
  },
  undoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
  },
  lastCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastCardLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginRight: 8,
  },
  lastCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 30,
    textAlign: 'center',
  },
  undoButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#4b5563',
  },
  undoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  handAnalysisContainer: {
    backgroundColor: '#1f2937',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  handSection: {
    marginBottom: 24,
  },
  handHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  handTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  handToggle: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 4,
    padding: 2,
  },
  handToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  activeHandButton: {
    backgroundColor: '#2563eb',
  },
  handToggleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  splitHandsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitHandColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  splitHandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  activeHandCard: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  playerCardButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#2563eb',
  },
  playerCardsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  playerCard: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  playerCardText: {
    color: '#ffffff',
    fontSize: 14,
  },
  handValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dealerCardButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#4b5563',
  },
  selectedDealerCard: {
    backgroundColor: '#dc2626',
  },
  dealerValue: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
  },
  recommendationBox: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  recommendationText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hitRecommendation: {
    backgroundColor: '#d97706',
  },
  standRecommendation: {
    backgroundColor: '#dc2626',
  },
  splitRecommendation: {
    backgroundColor: '#7c3aed',
  },
  doubleRecommendation: {
    backgroundColor: '#2563eb',
  },
  defaultRecommendation: {
    backgroundColor: '#4b5563',
  },
  splitButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  splitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  splitRecommendations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  splitRecommendationItem: {
    alignItems: 'center',
  },
  splitRecommendationLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  miniRecommendationBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  miniRecommendationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newHandButton: {
    backgroundColor: '#ea580c',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  newHandButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  // ADDED MISSING STYLES BELOW:
  bottomPadding: {
    height: 80, // Account for banner ad height
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  bannerPlaceholder: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  bannerPlaceholderText: {
    color: '#666',
    fontSize: 12,
  },
});

export default BlackjackCounter; 


